import * as fs from "fs";

export interface Konfiguracija {
  jwtValjanost: number;
  jwtTajniKljuc: string;
  tajniKljucSesija: string;
  tmdbApiKeyV3: string;
  tmdbApiKeyV4: string;
  captchaTajniKljuc: string;
}

export function ucitajKonfiguraciju(putanja: string): Konfiguracija {
  try {
    console.log("Putanja konfiguracijske datoteke:", putanja);

    const podaci = fs.readFileSync(putanja, "utf-8");
    const redovi = podaci.split("\n");
    const konfiguracija: any = {};

    for (const red of redovi) {
      const [kljuc, vrijednost] = red.split("#");
      if (kljuc && vrijednost) {
        konfiguracija[kljuc.trim()] = vrijednost.trim();
      }
    }

    console.log("Učitana konfiguracija:", konfiguracija);

    validirajKonfiguraciju(konfiguracija);
    console.log("Konfiguracija validna:", konfiguracija);

    return konfiguracija;
  } catch (e) {
    console.error("Greška kod učitavanja konfiguracije:", e);
    process.exit(1);
  }
}

function validirajKonfiguraciju(konf: any) {
  // Provjera jwtValjanost
  const valjanost = parseInt(konf.jwtValjanost);
  if (isNaN(valjanost) || valjanost < 15 || valjanost > 300) {
    throw new Error("JWT valjanost mora biti broj između 15 i 300");
  }
  konf.jwtValjanost = valjanost;

  // Provjera jwtTajniKljuc
  if (
    !konf.jwtTajniKljuc ||
    konf.jwtTajniKljuc.length < 100 ||
    konf.jwtTajniKljuc.length > 200
  ) {
    throw new Error("JWT tajni ključ mora biti između 100 i 200 znakova");
  }
  const tajniKljucRegex = /^[a-z0-9!%$]+$/;
  if (!tajniKljucRegex.test(konf.jwtTajniKljuc)) {
    throw new Error(
      "JWT tajni ključ smije sadržavati samo mala slova, brojke i znakove !%$"
    );
  }

  // Provjera ostalih obveznih polja
  const obveznaPolja = ["tajniKljucSesija", "tmdbApiKeyV3", "tmdbApiKeyV4"];
  for (const polje of obveznaPolja) {
    if (!konf[polje]) {
      throw new Error(`Nedostaje konfiguracijsko polje: ${polje}`);
    }
  }

  console.log("Konfiguracija validirana:", konf);
}
