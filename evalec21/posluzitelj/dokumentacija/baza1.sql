CREATE TABLE IF NOT EXISTS tip_korisnika (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naziv VARCHAR(45) NOT NULL,
    opis TEXT
);

CREATE TABLE IF NOT EXISTS korisnik (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ime VARCHAR(50),
    prezime VARCHAR(100),
    adresa TEXT,
    korime VARCHAR(50) NOT NULL UNIQUE,
    lozinka VARCHAR(1000) NOT NULL,
    email VARCHAR(100) NOT NULL,
    tip_korisnika_id INTEGER,
    FOREIGN KEY (tip_korisnika_id) REFERENCES tip_korisnika(id)
);

INSERT INTO tip_korisnika (naziv, opis) VALUES 
('administrator', 'Administrator sustava'),
('registrirani_korisnik', 'Registrirani korisnik sustava');

INSERT INTO korisnik (korime, lozinka, email, tip_korisnika_id) 
SELECT 'obican', 'rwa', 'obican@mail.com', id
FROM tip_korisnika WHERE naziv = 'registrirani_korisnik';

INSERT INTO korisnik (korime, lozinka, email, tip_korisnika_id) 
SELECT 'admin', 'rwa', 'admin@mail.com', id
FROM tip_korisnika WHERE naziv = 'administrator';