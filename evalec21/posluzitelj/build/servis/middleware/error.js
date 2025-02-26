"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMethodNotAllowed = handleMethodNotAllowed;
exports.handleInvalidParams = handleInvalidParams;
function handleMethodNotAllowed(req, res) {
    res.status(405).json({ greska: 'zabranjena metoda' });
}
function handleInvalidParams(req, res, next) {
    const dozvoljeniParams = ['stranica', 'datumOd', 'datumDo'];
    const params = Object.keys(req.query);
    const nepoznatiParam = params.find(p => !dozvoljeniParams.includes(p));
    if (nepoznatiParam) {
        return res.status(422).json({ greska: 'neočekivani podaci' });
    }
    next();
}
