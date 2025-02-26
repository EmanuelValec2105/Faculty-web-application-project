import { Request, Response } from "express";
import { Baza } from "../baza";
import { Database } from "sqlite3";
import { TOTP } from "totp-generator";
import { ParsedQs } from "qs";
import crypto from "crypto";

export class KorisnikHandler {
  private baza: Baza;

  constructor(db: Database) {
    this.baza = new Baza(db);
  }

  async registracija(req: Request, res: Response) {
    let { email, korime, lozinka, ime, prezime, adresa } = req.body;

    lozinka = zastitiLozinku(lozinka);
    if (
      email == "" ||
      !email ||
      korime == "" ||
      !korime ||
      lozinka == "" ||
      !lozinka
    ) {
      return res.status(400).json({
        greska: "Email, korisničko ime i lozinka su obavezni podaci!",
      });
    }

    try {
      const postojeci = await this.baza.izvrsiUpit(
        "SELECT * FROM korisnik WHERE korime = ? OR email = ?",
        [korime, email]
      );

      if (postojeci.length > 0) {
        return res
          .status(400)
          .json({ greska: "Korisničko ime ili email već postoji" });
      }

      await this.baza.izvrsiIzmjenu(
        `INSERT INTO korisnik (korime, lozinka, email, ime, prezime, adresa, tip_korisnika_id) 
                     VALUES (?, ?, ?, ?, ?, ?, 2)`,
        [korime, lozinka, email, ime, prezime, adresa]
      );

      res.status(201).json({ poruka: "Registracija uspješna" });
    } catch (error) {
      console.error("Greška:", error);
      res.status(500).json({ greska: "Greška prilikom registracije" });
    }
  }

  async prijava(req: any, res: Response) {
    let { korime, lozinka } = req.body;
    lozinka = zastitiLozinku(lozinka);
    try {
      const korisnici = await this.baza.izvrsiUpit(
        "SELECT k.*, tk.naziv as uloga FROM korisnik k JOIN tip_korisnika tk ON k.tip_korisnika_id = tk.id WHERE korime = ? AND lozinka = ?",
        [korime, lozinka]
      );

      if (korisnici.length > 0) {
        const korisnik = korisnici[0];
        req.session.korisnik = korisnik;
        res.json(korisnik);
      } else {
        res.status(401).json({ greska: "Neispravni podaci" });
      }
    } catch (error) {
      console.error("Greška:", error);
      res.status(500).json({ greska: "Greška sustava" });
    }
  }

  async prijavaTotp(req: Request, res: Response) {
    const kljuc = req.body["kljuc"];
    const korime = req.body["korime"];
    console.log(kljuc, korime);
    const korisnici = await this.baza.izvrsiUpit(
      "SELECT * FROM korisnik WHERE korime = ?",
      [korime]
    );

    if (korisnici.length > 0) {
      const korisnik = korisnici[0];

      let totp_tajna = korisnik.totp_tajna;
      const { otp } = TOTP.generate(totp_tajna, {
        digits: 6,
        algorithm: "SHA-512",
        period: 60,
      });
      if (kljuc == otp) {
        res.json(korisnik);
      } else {
        res.status(403).json({ greska: "Pogrešan kod" });
      }
    } else {
      res.status(400).json({ greska: "Nepoznata greska" });
    }
  }

  async odjava(req: Request, res: Response) {
    req.session.destroy((err) => {
      res.end();
    });
  }

  async trenutniKorisnik(req: Request, res: Response) {
    try {
      console.log("Dohvaćam korisnika iz sesije:", req.session.korisnik);
      const korisnici = await this.baza.izvrsiUpit(
        "SELECT k.*, tk.naziv as uloga FROM korisnik k JOIN tip_korisnika tk ON k.tip_korisnika_id = tk.id WHERE k.id = ?",
        [req.session.korisnik!.id]
      );

      if (korisnici.length > 0) {
        res.json(korisnici[0]);
      } else {
        res.status(404).json({ greska: "Korisnik nije pronađen" });
      }
    } catch (error) {
      console.error("Greška u dohvatu korisnika:", error);
      res.status(500).json({ greska: "Greška sustava" });
    }
  }

  async dohvatiSve(req: Request, res: Response) {
    try {
      const korisnici = await this.baza.izvrsiUpit(`
                SELECT *
                FROM korisnik`);

      res.status(200).json(korisnici);
    } catch (error) {
      console.error("Greška:", error);
      res.status(400).json({ greska: "Greška kod dohvaćanja korisnika" });
    }
  }

  async dodaj(req: Request, res: Response) {
    try {
      const { korime, email, ime, prezime } = req.body;

      // Provjera postojećeg korisnika
      const postojeci = await this.baza.izvrsiUpit(
        "SELECT * FROM korisnik WHERE korime = ? OR email = ?",
        [korime, email]
      );

      if (postojeci.length > 0) {
        return res.status(400).json({ greska: "Korisnik već postoji" });
      }

      // Dodavanje novog korisnika
      await this.baza.izvrsiIzmjenu(
        "INSERT INTO korisnik (korime, email, ime, prezime) VALUES (?, ?, ?, ?)",
        [korime, email, ime, prezime]
      );

      res.status(201).json({ status: "uspjeh" });
    } catch (error) {
      console.error("Greška:", error);
      res.status(400).json({ greska: "Greška kod dodavanja korisnika" });
    }
  }

  async obrisi(req: Request, res: Response) {
    try {
      const korime = req.params.korime;
      if (korime == req.session.korisnik?.korime) {
        res.status(400).json({ greska: "Korisnik ne može izbrisati sebe" });
        return;
      }
      const rezultat = await this.baza.izvrsiIzmjenu(
        "DELETE FROM korisnik WHERE korime = ?",
        [korime]
      );

      if (rezultat.changes === 0) {
        return res.status(404).json({ greska: "Korisnik nije pronađen" });
      }

      res.status(201).json({ status: "uspjeh" });
    } catch (error) {
      console.error("Greška:", error);
      res.status(400).json({ greska: "Greška kod brisanja korisnika" });
    }
  }

  async zahtjevPristupa(req: Request, res: Response) {
    try {
      const korime = req.params.korime;
      console.log(korime);
      await this.baza.izvrsiIzmjenu(
        "UPDATE korisnik SET zatrazio_pristup = 1 WHERE korime = ?",
        [korime]
      );
      res.status(201).json({ poruka: "Zahtjev poslan" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ greska: "Greška sustava" });
    }
  }

  async promjeniPristup(req: Request, res: Response) {
    try {
      const korime = req.params.korime;
      console.log(korime);
      const status = req.body["status"];
      await this.baza.izvrsiIzmjenu(
        "UPDATE korisnik SET ima_pristup = ? WHERE korime = ?",
        [status, korime]
      );
      res.status(201).json({ poruka: "Promjenjen status" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ greska: "Greška sustava" });
    }
  }

  async totp(req: Request, res: Response) {
    try {
      const activate = req.body["activate"];
      const korime = req.params.korime;
      if (activate) {
        const rezultat = await this.baza.izvrsiUpit(
          "SELECT totp_tajna FROM korisnik WHERE korime = ?",
          [korime]
        );
        let totp_tajna = rezultat[0].totp_tajna;
        if (totp_tajna == null || totp_tajna == "") {
          totp_tajna = generirajTotpTajniKljuc();
          await this.baza.izvrsiIzmjenu(
            "UPDATE korisnik SET totp_aktivan = 0, totp_tajna = ?  WHERE korime = ? ",
            [totp_tajna, korime]
          );
          res.status(201).json({ status: "uspjeh" });
          return;
        }
        await this.baza.izvrsiIzmjenu(
          "UPDATE korisnik SET totp_aktivan = 1 WHERE korime = ? ",
          [korime]
        );
        res.status(201).json({ status: "uspjeh" });
        return;
      } else {
        await this.baza.izvrsiIzmjenu(
          "UPDATE korisnik SET totp_aktivan = 0 WHERE korime = ? ",
          [korime]
        );
        res.status(201).json({ status: "uspjeh" });
      }
    } catch (error) {
      console.error("Greška kod mjenjanja totp-a:", error);
      res.status(400).json({ greska: "Greška kod mijenjanja statusa TOTP-a" });
    }
  }
}
function generirajTotpTajniKljuc(): string {
  let length = 5;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function zastitiLozinku(text: string) {
  const hash = crypto.createHash("sha256");
  hash.write(text + "SOlzaLozinku");
  const encryptedText = hash.digest("hex");
  hash.end();
  return encryptedText;
}
