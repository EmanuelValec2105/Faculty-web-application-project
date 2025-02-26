"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucitajKonfiguraciju = ucitajKonfiguraciju;
const fs = __importStar(require("fs"));
function ucitajKonfiguraciju(putanja) {
    try {
        console.log("Putanja konfiguracijske datoteke:", putanja);
        const podaci = fs.readFileSync(putanja, "utf-8");
        const redovi = podaci.split("\n");
        const konfiguracija = {};
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
    }
    catch (e) {
        console.error("Greška kod učitavanja konfiguracije:", e);
        process.exit(1);
    }
}
function validirajKonfiguraciju(konf) {
    // Provjera jwtValjanost
    const valjanost = parseInt(konf.jwtValjanost);
    if (isNaN(valjanost) || valjanost < 15 || valjanost > 300) {
        throw new Error("JWT valjanost mora biti broj između 15 i 300");
    }
    konf.jwtValjanost = valjanost;
    // Provjera jwtTajniKljuc
    if (!konf.jwtTajniKljuc ||
        konf.jwtTajniKljuc.length < 100 ||
        konf.jwtTajniKljuc.length > 200) {
        throw new Error("JWT tajni ključ mora biti između 100 i 200 znakova");
    }
    const tajniKljucRegex = /^[a-z0-9!%$]+$/;
    if (!tajniKljucRegex.test(konf.jwtTajniKljuc)) {
        throw new Error("JWT tajni ključ smije sadržavati samo mala slova, brojke i znakove !%$");
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
