import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { ucitajKonfiguraciju } from "./konfiguracija";
import { provjeriToken, provjeriAdmin } from "./jwt";
import { OsobaHandler } from "./handlers/osobaHandler";
import { KorisnikHandler } from "./handlers/korisnikHandler";
import { Baza } from "./baza";
import os from "os";
import path from "path";
import session from "express-session";
import sqlite3 from "sqlite3";
import { FilmHandler } from "./handlers/filmHandler";

function dajPort(korime: string): number {
  const HOST = os.hostname();
  let port = null;
  if (HOST != "spider") {
    port = 12222;
  } else {
    const portovi = require("/var/www/RWA/2024/portovi.js");
    port = portovi[korime];
  }
  return port;
}

const app = express();

// Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const port = dajPort("evalec21");
const putanjaKonfiguracije =
  process.argv.length > 2 ? process.argv[2] : "podaci/konfiguracija.csv";
const konf = ucitajKonfiguraciju(putanjaKonfiguracije);

app.use(
  session({
    secret: konf.tajniKljucSesija,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(
  cors({
    origin: function (origin, povratniPoziv) {
      if (!origin || origin.startsWith("http://localhost:")) {
        povratniPoziv(null, true);
      } else {
        povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (cookies)
    optionsSuccessStatus: 200,
  })
);

const bazaWeb = new sqlite3.Database("podaci/RWA2024evalec21_web.sqlite");
const bazaServis = new sqlite3.Database("podaci/RWA2024evalec21_servis.sqlite");
// Inicijalizacija handlera za korisnike (koristi web bazu)
const korisnikHandler = new KorisnikHandler(bazaWeb);

// Middleware za provjeru
const provjeriPrijavu = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.korisnik) {
    next();
  } else {
    res.status(401).end();
  }
};
app.post("/servis/app/registracija", (req, res) =>
  korisnikHandler.registracija(req, res)
);

app.post("/servis/app/prijava", async (req, res) =>
  korisnikHandler.prijava(req, res)
);
app.post("/servis/app/prijava/totp", async (req, res) =>
  korisnikHandler.prijavaTotp(req, res)
);

app.post("/servis/app/recaptcha", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).send({ message: "Token is missing" });
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: konf.captchaTajniKljuc,
          response: token,
        }),
      }
    );
    const data = await response.json();
    console.log(data);

    if (data.success && data.score > 0.5) {
      res.status(200).end();
    } else {
      res.status(400).send({ greska: "Roboti nisu dozvoljeni" });
    }
  } catch (error) {
    res.status(500).send({ message: "Nepoznata greška" });
  }
});

app.post("/servis/app/odjava", (req, res) => korisnikHandler.odjava(req, res));

app.get("/servis/app/korisnik", provjeriPrijavu, async (req, res) =>
  korisnikHandler.trenutniKorisnik(req, res)
);

app.post("/servis/app/dajToken", (req, res) => {
  console.log("Zahtjev za token, sesija:", req.session);
  if (!req.session.korisnik) {
    console.log("Nema korisnika u sesiji");
    return res.status(401).json({ greska: "Niste prijavljeni" });
  }

  console.log("Kreiram token za korisnika:", req.session.korisnik);
  const token = jwt.sign(
    {
      korime: req.session.korisnik.korime,
      tip: req.session.korisnik.uloga,
    },
    konf.jwtTajniKljuc,
    { expiresIn: konf.jwtValjanost }
  );

  console.log("Token kreiran");
  res.status(201).json({ token });
});

const osobaHandler = new OsobaHandler(konf, bazaServis);
const filmHandler = new FilmHandler(konf, bazaServis);

app.post("/servis/app/korisnici/:korime/zatraziPristup", (req, res) =>
  korisnikHandler.zahtjevPristupa(req, res)
);

// Zaštićene rute - potreban JWT token
app.use("/servis/app/*", provjeriToken(konf));

// Korisnik endpointi
app.get("/servis/app/korisnici", provjeriAdmin, (req, res) =>
  korisnikHandler.dohvatiSve(req, res)
);
app.post("/servis/app/korisnici", provjeriAdmin, (req, res) =>
  korisnikHandler.dodaj(req, res)
);
app.delete("/servis/app/korisnici/:korime", provjeriAdmin, (req, res) =>
  korisnikHandler.obrisi(req, res)
);

app.post(
  "/servis/app/korisnici/:korime/promjeniPristup",
  provjeriAdmin,
  (req, res) => korisnikHandler.promjeniPristup(req, res)
);

app.post("/servis/app/korisnici/:korime/totp", (req, res) =>
  korisnikHandler.totp(req, res)
);

// Osoba endpointi
app.get("/servis/app/osoba", (req, res) => osobaHandler.dohvatiSve(req, res));
app.post("/servis/app/osoba", provjeriAdmin, (req, res) =>
  osobaHandler.dodaj(req, res)
);
app.get("/servis/app/osoba/:id", (req, res) =>
  osobaHandler.dohvatiJednu(req, res)
);

app.delete("/servis/app/osoba/:id", provjeriAdmin, (req, res) =>
  osobaHandler.obrisi(req, res)
);
app.get("/servis/app/osoba/:id/film", (req, res) =>
  osobaHandler.dohvatiFilmove(req, res)
);
app.get("/servis/app/tmdb/osobe", provjeriAdmin, (req, res) =>
  osobaHandler.pretraziOsobe(req, res)
);

app.get("/servis/app/filmovi", (req, res) => filmHandler.dohvatiSve(req, res));

app.use("/servis/app/*", (req, res) => {
  res.status(404).json({ greska: "nepostojeći resurs" });
});

const angularDistPath = path.join(__dirname, "../../angular/browser");
app.use(express.static(angularDistPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(angularDistPath, "index.csr.html"));
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Server error:", err);
  res.status(500).json({ greska: "Interna greška servera" });
});

app.listen(port, () => {
  console.log(`Server pokrenut na portu ${port}`);
});
