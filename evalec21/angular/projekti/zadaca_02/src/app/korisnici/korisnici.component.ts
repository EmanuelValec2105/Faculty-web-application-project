import { Component } from '@angular/core';
import { KorisniciService } from '../servisi/korisnici.service';
import { IKorisnik } from '../modeli/IKorisnik';
import { AuthService } from '../servisi/auth.service';

@Component({
  selector: 'app-korisnici',
  standalone: false,

  templateUrl: './korisnici.component.html',
  styleUrl: './korisnici.component.scss',
})
export class KorisniciComponent {
  constructor(
    private korisniciServis: KorisniciService,
    private auth: AuthService
  ) {}
  korisnici!: Array<IKorisnik>;

  ngOnInit() {
    this.dohvatiKorisnike();
  }

  async dohvatiKorisnike() {
    (await this.korisniciServis.dohvatiKorisnike()).subscribe((r) => {
      this.korisnici = r;
    });
  }

  async obrisiKorisnika(korime: string) {
    if (korime == this.auth.prijavljeniKorisnik.getValue()?.korime) {
      alert('Ne možete obrisati sami sebe');
      return;
    }
    (await this.korisniciServis.obrisiKorisnika(korime)).subscribe({
      next: (r) => {
        this.dohvatiKorisnike();
      },
      error: (err) => console.log(err),
    });
  }

  async promjeniPristup(status: boolean, korime: string) {
    (await this.korisniciServis.promjeniPristup(status, korime)).subscribe({
      next: (r) => {
        this.dohvatiKorisnike();
      },
      error: (err) => console.log(err),
    });
  }
}
