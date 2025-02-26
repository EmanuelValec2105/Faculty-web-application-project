import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { IFilm } from '../modeli/IFilm';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  constructor(private auth: AuthService, private http: HttpClient) {}

  async dohvati(stranica: number) {
    const token = await this.auth.dajToken();

    return this.http.get<Array<IFilm>>(
      `${environment.restHost}:${environment.restPort}/servis/app/filmovi?stranica=${stranica}`,
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }
}
