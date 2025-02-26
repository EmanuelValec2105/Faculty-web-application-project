import { Request, Response } from "express";
import { Baza } from "../baza";
import { TmdbKlijent } from "../tmdb/tmdbKlijent";
import { Konfiguracija } from "../konfiguracija";
import { Database } from "sqlite3";

export class OsobaHandler {
  private baza: Baza;
  private tmdb: TmdbKlijent;

  constructor(konf: Konfiguracija, db: Database) {
    this.baza = new Baza(db);
    this.tmdb = new TmdbKlijent(konf);
  }

  async dohvatiSve(req: Request, res: Response) {
    const stranica = Number(req.query.stranica) || 1;
    const brojPoStranici = Number(req.query.brojPoStranici) || 20;
    const offset = (stranica - 1) * brojPoStranici;
    console.log("Dohvaćam osobe za stranicu:",stranica,"broj po stranici:",brojPoStranici);

    try {
      const osobe = await this.baza.izvrsiUpit(
        `SELECT * FROM osoba LIMIT ${brojPoStranici} OFFSET ${offset} `
      );
      res.status(200).json(osobe);
    } catch (error) {
      console.error("Greška kod dohvata osoba:", error);
      res.status(400).json({ greska: "Greška kod dohvata osoba" });
    }
  }

  async dodaj(req: Request, res: Response) {
    try {
      const { tmdb_id } = req.body;

      // Provjeri postoji li osoba već u bazi
      const postojecaOsoba = await this.baza.izvrsiUpit(
        "SELECT * FROM osoba WHERE tmdb_id = ?",
        [tmdb_id]
      );

      if (postojecaOsoba.length > 0) {
        return res.status(400).json({
          greska: "Osoba već postoji u bazi",
        });
      }

      // Dohvati podatke o osobi s TMDB-a
      const tmdbOsoba = await this.tmdb.dohvatiDetaljeOsobe(Number(tmdb_id));
      console.log("Dohvaćeni detalji osobe:", tmdbOsoba);

      // Spremi osnovne podatke o osobi
      const rezultat = await this.baza.izvrsiIzmjenu(
        `INSERT INTO osoba (tmdb_id, ime, poznat_po, popularnost, slika) 
                 VALUES (?, ?, ?, ?, ?)`,
        [
          tmdb_id,
          tmdbOsoba.name,
          tmdbOsoba.known_for_department,
          tmdbOsoba.popularity,
          tmdbOsoba.profile_path,
        ]
      );

      // Dohvati i spremi slike iz galerije
      const slike = await this.tmdb.dohvatiSlikeOsobe(Number(tmdb_id));
      if (slike.profiles) {
        for (const profil of slike.profiles) {
          await this.baza.izvrsiIzmjenu(
            "INSERT INTO galerija_slika (osoba_id, slika_url) VALUES (?, ?)",
            [rezultat.lastID, profil.file_path]
          );
        }
      }

      // Dohvati i spremi filmove
      const filmovi = await this.tmdb.dohvatiFilmoveOsobe(Number(tmdb_id));
      if (filmovi.cast) {
        for (const film of filmovi.cast) {
          // Prvo provjeri postoji li film već u bazi
          let filmId;
          const postojeciFilm = await this.baza.izvrsiUpit(
            "SELECT id FROM film WHERE tmdb_id = ?",
            [film.id]
          );

          if (postojeciFilm.length === 0) {
            // Dodaj novi film
            const rezultatFilm = await this.baza.izvrsiIzmjenu(
              `INSERT INTO film (tmdb_id, jezik, originalni_naslov, naslov, 
                             popularnost, poster, datum_izdanja, opis)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                film.id,
                film.original_language,
                film.original_title,
                film.title,
                film.popularity,
                film.poster_path,
                film.release_date,
                film.overview,
              ]
            );
            filmId = rezultatFilm.lastID;
          } else {
            filmId = postojeciFilm[0].id;
          }

          // Dodaj vezu osoba-film
          await this.baza.izvrsiIzmjenu(
            "INSERT INTO osoba_film (osoba_id, film_id, uloga) VALUES (?, ?, ?)",
            [rezultat.lastID, filmId, film.character]
          );
        }
      }

      res.status(201).json({ status: "uspjeh" });
    } catch (error) {
      console.error("Greška kod dodavanja osobe:", error);
      res.status(400).json({ greska: "Greška kod dodavanja osobe" });
    }
  }

  async dohvatiJednu(req: Request, res: Response) {
    try {
      const tmdbId = Number(req.params.id); // Konverzija u broj
      console.log("Primljeni TMDB ID:", tmdbId);

      const [osoba] = await this.baza.izvrsiUpit(
        "SELECT * FROM osoba WHERE tmdb_id = ?",
        [tmdbId]
      );
      osoba.galerija = await this.baza.izvrsiUpit(
        "SELECT * FROM galerija_slika WHERE osoba_id = ?",
        [osoba.id]
      );

      osoba.filmovi = await this.baza.izvrsiUpit(
        "SELECT * FROM osoba_film INNER JOIN film on film.id = osoba_film.film_id WHERE osoba_film.osoba_id = ? LIMIT 20",
        [osoba.id]
      );

      console.log("Finalni rezultat:", osoba);
      res.status(200).json(osoba);
    } catch (error) {
      console.error("Greška kod dohvata osobe ili filmova sa TMDB-a:", error);
      res.status(400).json({ greska: "Greška kod dohvata osobe" });
    }
  }

  async dohvatiFilmove(req: Request, res: Response) {
    try {
      const osobaId = req.params.id;
      let stranica = Number(req.query.stranica) || 2;
      if (stranica < 2) stranica = 2;
      const limit = 20;
      const offset = (stranica - 1) * limit;

      const sql = `
                SELECT *
                FROM film f
                JOIN osoba_film of ON f.id = of.film_id
                WHERE of.osoba_id = ?
                LIMIT 20 OFFSET ${offset}
            `;
      const filmovi = await this.baza.izvrsiUpit(sql, [osobaId]);
      res.status(200).json(filmovi);
    } catch (error) {
      console.error("Greška kod dohvata filmova:", error);
      res.status(400).json({ greska: "Greška kod dohvata filmova osobe" });
    }
  }

  async pretraziOsobe(req: Request, res: Response) {
    try {
      const pojam = req.query.pojam?.toString();

      if (!pojam) {
        return res.status(400).json({ greska: "Nedostaje pojam za pretragu" });
      }

      const rezultati = await this.tmdb.pretraziOsobe(pojam);
      res.status(200).json(rezultati.results || []);
    } catch (error) {
      console.error("Greška kod pretrage osoba:", error);
      res.status(400).json({ greska: "Greška kod pretrage osoba" });
    }
  }

  async obrisi(req: Request, res: Response) {
    try {
      const tmdbId = req.params.id;
      const [osoba] = await this.baza.izvrsiUpit(
        "SELECT * FROM osoba WHERE tmdb_id = ?",
        [tmdbId]
      );
      if (!osoba) {
        res.status(404).json({ greska: "Osoba nije pronađena u bazi" });
        return;
      }

      const filmovi = await this.baza.izvrsiUpit(
        "SELECT * FROM osoba_film where osoba_id = ?",
        [osoba.id]
      );
      await this.baza.izvrsiIzmjenu(
        "DELETE FROM osoba_film WHERE osoba_id = ?",
        [osoba.id]
      );

      for (let film of filmovi) {
        const imaJos =
          (
            await this.baza.izvrsiUpit(
              "SELECT * FROM osoba_film where film_id = ?",
              [film.id]
            )
          ).length > 0;

        if (imaJos == false) {
          await this.baza.izvrsiUpit("DELETE FROM film WHERE id = ?", [
            film.id,
          ]);
        }
      }
      await this.baza.izvrsiIzmjenu("DELETE FROM osoba WHERE tmdb_id = ?", [
        tmdbId,
      ]);

      res.status(201).json({ status: "uspjeh" });
    } catch (error) {
      console.error("Greška kod brisanja osobe:", error);
      res.status(400).json({ greska: "Greška kod brisanja osobe" });
    }
  }
}
