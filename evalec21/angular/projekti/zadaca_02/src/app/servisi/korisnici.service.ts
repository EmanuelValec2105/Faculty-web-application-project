import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { IKorisnik } from '../modeli/IKorisnik';

@Injectable({
  providedIn: 'root',
})
export class KorisniciService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async dohvatiKorisnike() {
    const token = await this.auth.dajToken();

    return this.http.get<Array<IKorisnik>>(
      `${environment.restHost}:${environment.restPort}/servis/app/korisnici`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  async promjeniPristup(status: boolean, korime: string) {
    const token = await this.auth.dajToken();

    return this.http.post(
      `${environment.restHost}:${environment.restPort}/servis/app/korisnici/${korime}/promjeniPristup`,
      {
        status,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  async obrisiKorisnika(korime: string) {
    const token = await this.auth.dajToken();

    return this.http.delete(
      `${environment.restHost}:${environment.restPort}/servis/app/korisnici/${korime}`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }
}
