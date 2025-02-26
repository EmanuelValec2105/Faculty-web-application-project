"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TmdbKlijent = void 0;
class TmdbKlijent {
    baseURL = 'https://api.themoviedb.org/3';
    apiKey;
    constructor(konf) {
        this.apiKey = konf.tmdbApiKeyV3;
    }
    async dohvatiOsobe(stranica = 1) {
        try {
            console.log('Dohvaćam popularne osobe sa TMDB-a, stranica:', stranica);
            const url = `${this.baseURL}/person/popular?api_key=${this.apiKey}&language=en-US&page=${stranica}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`TMDB API greška: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log(`Dohvaćeno ${data.results.length} osoba`);
            return data;
        }
        catch (error) {
            console.error('TMDB greška kod dohvata osoba:', error);
            throw error;
        }
    }
    async dohvatiDetaljeOsobe(tmdbId) {
        try {
            const url = `${this.baseURL}/person/${tmdbId}?api_key=${this.apiKey}&language=en-US&append_to_response=images`;
            console.log("TMDB URL:", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`TMDB API greška: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Greška kod dohvata detalja osobe sa TMDB-a:", error);
            throw error;
        }
    }
    async dohvatiSlikeOsobe(osobaId) {
        try {
            const url = `${this.baseURL}/person/${osobaId}/images?api_key=${this.apiKey}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`TMDB API greška: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('TMDB greška kod dohvata slika:', error);
            throw error;
        }
    }
    async dohvatiFilmoveOsobe(tmdbId) {
        try {
            const url = `${this.baseURL}/person/${tmdbId}/movie_credits?api_key=${this.apiKey}&language=en-US`;
            console.log("TMDB URL za filmove:", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`TMDB API greška: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Greška kod dohvata filmova osobe sa TMDB-a:", error);
            throw error;
        }
    }
    async pretraziOsobe(pojam) {
        try {
            const url = `${this.baseURL}/search/person?api_key=${this.apiKey}&query=${encodeURIComponent(pojam)}&language=en-US&page=1`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`TMDB API greška: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('TMDB greška kod pretrage osoba:', error);
            throw error;
        }
    }
}
exports.TmdbKlijent = TmdbKlijent;
