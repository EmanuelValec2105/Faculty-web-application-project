import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Konfiguracija } from './konfiguracija';
import { Baza } from './baza';
import './types';

export interface JwtPayload {
    korime: string;
    tip: string;
}

export function provjeriToken(konf: Konfiguracija) {
    return async function (req: Request, res: Response, next: NextFunction) {
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
            const decoded = jwt.verify(token, konf.jwtTajniKljuc) as JwtPayload;
            console.log('Dekodirani token:', decoded);
            
            req.user = decoded;
            next();
        } catch (err) {
            console.error('JWT greška:', err);
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(406).json({ greska: 'JWT nije prihvaćen - istekao' });
            }
            return res.status(406).json({ greska: 'JWT nije prihvaćen' });
        }
    };
}

export function provjeriAdmin(req: Request, res: Response, next: NextFunction) {
    console.log('Provjera administratorskih prava...');
    if (req.user?.tip !== 'administrator') {
        console.error('Korisnik nema administratorska prava:', req.user);
        return res.status(403).json({ greska: 'zabranjen pristup' });
    }
    console.log('Korisnik ima administratorska prava');
    next();
}
