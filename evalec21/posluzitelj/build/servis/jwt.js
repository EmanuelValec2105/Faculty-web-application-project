"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provjeriToken = provjeriToken;
exports.provjeriAdmin = provjeriAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("./types");
function provjeriToken(konf) {
    return async function (req, res, next) {
        console.log('Headers:', req.headers);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(406).json({ greska: 'JWT nije prihvaćen' });
        }
        const dijelovi = authHeader.split(' ');
        if (dijelovi[0] !== 'Bearer' || !dijelovi[1]) {
            return res.status(406).json({ greska: 'JWT nije prihvaćen' });
        }
        const token = dijelovi[1];
        console.log('Primljeni token:', token);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, konf.jwtTajniKljuc);
            console.log('Dekodirani token:', decoded);
            req.user = decoded;
            next();
        }
        catch (err) {
            console.error('JWT greška:', err);
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(406).json({ greska: 'JWT nije prihvaćen - istekao' });
            }
            return res.status(406).json({ greska: 'JWT nije prihvaćen' });
        }
    };
}
function provjeriAdmin(req, res, next) {
    console.log('Provjera administratorskih prava...');
    if (req.user?.tip !== 'administrator') {
        console.error('Korisnik nema administratorska prava:', req.user);
        return res.status(403).json({ greska: 'zabranjen pristup' });
    }
    console.log('Korisnik ima administratorska prava');
    next();
}
