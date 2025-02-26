import { Request, Response, NextFunction } from 'express';

export function handleMethodNotAllowed(req: Request, res: Response) {
    res.status(405).json({ greska: 'zabranjena metoda' });
}

export function handleInvalidParams(req: Request, res: Response, next: NextFunction) {
    const dozvoljeniParams = ['stranica', 'datumOd', 'datumDo'];
    const params = Object.keys(req.query);
    
    const nepoznatiParam = params.find(p => !dozvoljeniParams.includes(p));
    if (nepoznatiParam) {
        return res.status(422).json({ greska: 'neočekivani podaci' });
    }
    next();
}