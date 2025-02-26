import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IOsoba } from '../modeli/IOsoba';
import { IOsobaDetalji } from '../modeli/IOsobaDetalji';
import { IFilm } from '../modeli/IFilm';
import { IPretragaRezultat } from '../modeli/IPretragaRezultat';

@Injectable({
  providedIn: 'root',
})
export class OsobeService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async dohvatiOsobe(trenutnaStranica: number, brojPoStranici: number) {
    const token = await this.auth.dajToken();

    return this.http.get<Array<IOsoba>>(
      `${environment.restHost}:${environment.restPort}/servis/app/osoba?stranica=${trenutnaStranica}&brojPoStranici=${brojPoStranici}`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  async dohvatiDetaljeOsobe(osobaId: string) {
    const token = await this.auth.dajToken();

    return this.http.get<IOsobaDetalji>(
      `${environment.restHost}:${environment.restPort}/servis/app/osoba/${osobaId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  async dohvatiFilmove(osobaId: string, stranica: number) {
    const token = await this.auth.dajToken();

    return this.http.get<Array<IFilm>>(
      `${environment.restHost}:${environment.restPort}/servis/app/osoba/${osobaId}/film?stranica=${stranica}`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  async pretraziOsobe(pojam: string) {
    const token = await this.auth.dajToken();

    return this.http.get<Array<IPretragaRezultat>>(
      `${environment.restHost}:${
        environment.restPort
      }/servis/app/tmdb/osobe?pojam=${encodeURIComponent(pojam)}`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  async dodajOsobu(id: number) {
    const token = await this.auth.dajToken();

    return this.http.post(
      `${environment.restHost}:${environment.restPort}/servis/app/osoba`,
      { tmdb_id: id },
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  async makniOsobu(id: number) {
    const token = await this.auth.dajToken();

    return this.http.delete(
      `${environment.restHost}:${environment.restPort}/servis/app/osoba/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }
}
