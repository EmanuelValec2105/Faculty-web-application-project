import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IKorisnik } from '../modeli/IKorisnik';
import { BehaviorSubject, catchError, firstValueFrom, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  prijavljeniKorisnik = new BehaviorSubject<IKorisnik | null>(null);

  prijava(korime: string, lozinka: string) {
    return this.http.post<IKorisnik>(
      environment.restHost + ':' + environment.restPort + '/servis/app/prijava',
      {
        korime,
        lozinka,
      },
      { withCredentials: true }
    );
  }

  prijavaTotp(totp: string, korime: string) {
    return this.http.post<IKorisnik>(
      environment.restHost +
        ':' +
        environment.restPort +
        '/servis/app/prijava/totp',
      {
        kljuc: totp,
        korime,
      },
      { withCredentials: true }
    );
  }

  trenutniKorisnik() {
    return this.http
      .get<IKorisnik>(
        environment.restHost +
          ':' +
          environment.restPort +
          '/servis/app/korisnik',
        { withCredentials: true }
      )
      .pipe(
        catchError((err, caught) => {
          this.router.navigate(['/prijava']);
          this.prijavljeniKorisnik.next(null);
          throw err;
        })
      );
  }

  async dajToken() {
    if (this.prijavljeniKorisnik.getValue() == null) {
      const k = await this.trenutniKorisnik().toPromise();
      if (!k) {
        this.router.navigate(['/prijava']);
        return;
      }
      this.prijavljeniKorisnik.next(k);
    }
    if (this.prijavljeniKorisnik.getValue()?.ima_pristup != 1) {
      alert('Nemate pravo pristupa');
      this.router.navigate(['/pocetna']);
      return;
    }
    const response = await this.http
      .post<{ token: string }>(
        environment.restHost +
          ':' +
          environment.restPort +
          '/servis/app/dajToken',
        {},
        { withCredentials: true }
      )
      .toPromise()
      .catch((e) => {
        this.router.navigate(['/prijava']);
      });
    return response!.token;
  }

  odjava() {
    this.prijavljeniKorisnik.next(null);
    return this.http.post(
      environment.restHost + ':' + environment.restPort + '/servis/app/odjava',
      {},
      { withCredentials: true }
    );
  }

  registracija(
    email: string,
    korime: string,
    lozinka: string,
    ime: string,
    prezime: string,
    adresa: string
  ) {
    return this.http.post(
      environment.restHost +
        ':' +
        environment.restPort +
        '/servis/app/registracija',
      {
        email,
        korime,
        lozinka,
        ime,
        prezime,
        adresa,
      },
      { withCredentials: true }
    );
  }

  async totp(korime: string, status: boolean) {
    const token = await this.dajToken();
    return this.http.post(
      environment.restHost +
        ':' +
        environment.restPort +
        `/servis/app/korisnici/${korime}/totp`,
      {
        activate: status,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  recaptcha(token: string) {
    return this.http.post(
      environment.restHost +
        ':' +
        environment.restPort +
        '/servis/app/recaptcha',
      {
        token,
      },
      { withCredentials: true }
    );
  }

  async zatraziPristup() {
    const korime = this.prijavljeniKorisnik.getValue()?.korime;
    return this.http.post(
      `${environment.restHost}:${environment.restPort}/servis/app/korisnici/${korime}/zatraziPristup`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
