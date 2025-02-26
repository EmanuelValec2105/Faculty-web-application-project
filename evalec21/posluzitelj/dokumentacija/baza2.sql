CREATE TABLE IF NOT EXISTS osoba (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_id INTEGER UNIQUE NOT NULL,
    ime VARCHAR(100) NOT NULL,
    slika VARCHAR(255),         -- profile_path
    poznat_po VARCHAR(100),     -- known_for_department
    popularnost DECIMAL(10,2),
    datum_unosa DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS galerija_slika (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    osoba_id INTEGER NOT NULL,
    slika_url VARCHAR(255) NOT NULL,  -- file_path
    FOREIGN KEY (osoba_id) REFERENCES osoba(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS film (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_id INTEGER UNIQUE NOT NULL,
    jezik VARCHAR(10),          -- original_language
    originalni_naslov TEXT,     -- original_title
    naslov TEXT NOT NULL,       -- title
    popularnost DECIMAL(10,2),
    poster VARCHAR(255),        -- poster_path
    datum_izdanja DATE,         -- release_date
    opis TEXT,                  -- overview
    datum_unosa DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS osoba_film (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    osoba_id INTEGER NOT NULL,
    film_id INTEGER NOT NULL,
    uloga VARCHAR(100),         -- character
    FOREIGN KEY (osoba_id) REFERENCES osoba(id) ON DELETE CASCADE,
    FOREIGN KEY (film_id) REFERENCES film(id) ON DELETE CASCADE
);

CREATE INDEX idx_osoba_tmdb_id ON osoba(tmdb_id);
CREATE INDEX idx_film_tmdb_id ON film(tmdb_id);
CREATE INDEX idx_film_datum_izdanja ON film(datum_izdanja);
CREATE INDEX idx_osoba_film_veza ON osoba_film(osoba_id, film_id);