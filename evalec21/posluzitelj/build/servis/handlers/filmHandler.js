"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmHandler = void 0;
const baza_1 = require("../baza");
const tmdbKlijent_1 = require("../tmdb/tmdbKlijent");
class FilmHandler {
    baza;
    tmdb;
    constructor(konf, db) {
        this.baza = new baza_1.Baza(db);
        this.tmdb = new tmdbKlijent_1.TmdbKlijent(konf);
    }
    async dohvatiSve(req, res) {
        try {
            const stranica = Number(req.query.stranica) || 1;
            const datumOd = req.query.datumOd
                ? new Date(Number(req.query.datumOd))
                : null;
            const datumDo = req.query.datumDo
                ? new Date(Number(req.query.datumDo))
                : null;
            const limit = 20;
            const offset = (stranica - 1) * limit;
            let sql = "SELECT * FROM film";
            const params = [];
            if (datumOd && datumDo) {
                sql += " WHERE datum_izdanja BETWEEN ? AND ?";
                params.push(datumOd.toISOString().split("T")[0], datumDo.toISOString().split("T")[0]);
            }
            sql += " LIMIT ? OFFSET ?";
            params.push(limit, offset);
            const filmovi = await this.baza.izvrsiUpit(sql, params);
            res.status(200).json(filmovi);
        }
        catch (error) {
            console.error("Greška:", error);
            res.status(400).json({ greska: "Greška kod dohvata filmova" });
        }
    }
    async dohvatiJedan(req, res) {
        try {
            const id = req.params.id;
            const sql = "SELECT * FROM film WHERE id = ?";
            const film = await this.baza.izvrsiUpit(sql, [id]);
            if (film.length === 0) {
                return res.status(404).json({ greska: "Film nije pronađen" });
            }
            res.status(200).json(film[0]);
        }
        catch (error) {
            console.error("Greška:", error);
            res.status(400).json({ greska: "Greška kod dohvata filma" });
        }
    }
    async dodaj(req, res) {
        try {
            const { tmdb_id, jezik, originalni_naslov, naslov, popularnost, poster, datum_izdanja, opis, } = req.body;
            const postojeciFilm = await this.baza.izvrsiUpit("SELECT id FROM film WHERE tmdb_id = ?", [tmdb_id]);
            if (postojeciFilm.length > 0) {
                return res.status(400).json({ greska: "Film već postoji" });
            }
            const sql = `
                INSERT INTO film (tmdb_id, jezik, originalni_naslov, naslov, 
                                popularnost, poster, datum_izdanja, opis)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await this.baza.izvrsiIzmjenu(sql, [
                tmdb_id,
                jezik,
                originalni_naslov,
                naslov,
                popularnost,
                poster,
                datum_izdanja,
                opis,
            ]);
            res.status(201).json({ status: "uspjeh" });
        }
        catch (error) {
            console.error("Greška:", error);
            res.status(400).json({ greška: "Greška kod dodavanja filma" });
        }
    }
    async obrisi(req, res) {
        try {
            const id = req.params.id;
            // Provjeri postoje li veze s osobama
            const veze = await this.baza.izvrsiUpit("SELECT COUNT(*) as broj FROM osoba_film WHERE film_id = ?", [id]);
            if (veze[0].broj > 0) {
                return res.status(400).json({
                    greska: "Film se ne može obrisati jer ima povezanih osoba",
                });
            }
            await this.baza.izvrsiIzmjenu("DELETE FROM film WHERE id = ?", [id]);
            res.status(201).json({ status: "uspjeh" });
        }
        catch (error) {
            console.error("Greška:", error);
            res.status(400).json({ greska: "Greška kod brisanja filma" });
        }
    }
}
exports.FilmHandler = FilmHandler;
