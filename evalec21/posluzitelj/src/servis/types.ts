import { Request } from 'express';
import { JwtPayload } from './jwt';

declare module 'express-session' {
    interface SessionData {
        korisnik: {
            id: number;
            korime: string;
            uloga: string;
        }
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}