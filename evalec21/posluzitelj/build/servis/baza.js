"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Baza = void 0;
class Baza {
    db;
    static instance;
    static bazaPath;
    constructor(db) {
        this.db = db;
    }
    static postaviPutanju(putanja) {
        Baza.bazaPath = putanja;
    }
    izvrsiUpit(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            });
        });
    }
    izvrsiIzmjenu(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (error) {
                if (error)
                    reject(error);
                else
                    resolve(this);
            });
        });
    }
}
exports.Baza = Baza;
