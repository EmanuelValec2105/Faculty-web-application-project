import sqlite3 from "sqlite3";
import { Database, RunResult } from "sqlite3";

export class Baza {
  private db: Database;
  private static instance: Baza;
  private static bazaPath: string;

  constructor(db: Database) {
    this.db = db;
  }

  public static postaviPutanju(putanja: string) {
    Baza.bazaPath = putanja;
  }

  public izvrsiUpit(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) reject(error);
        else resolve(rows);
      });
    });
  }

  public izvrsiIzmjenu(sql: string, params: any[] = []): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (error) {
        if (error) reject(error);
        else resolve(this);
      });
    });
  }
}
