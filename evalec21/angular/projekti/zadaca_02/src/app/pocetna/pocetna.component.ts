import { Component } from '@angular/core';
import { IKorisnik } from '../modeli/IKorisnik';
import { AuthService } from '../servisi/auth.service';

@Component({
  selector: 'app-pocetna',
  standalone: false,

  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.scss',
})
export class PocetnaComponent {
  constructor(private auth: AuthService) {}

  korisnik!: IKorisnik | null;

  ngOnInit() {
    this.auth.trenutniKorisnik().subscribe({
      next: (r) => {
        console.log(r);
        this.korisnik = r;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  async zatraziPrisutp() {
    (await this.auth.zatraziPristup()).subscribe({
      next: (r) => {
        alert('Pristup zatražen');
      },
      error: (err) => {
        console.log(err);
        alert(err.error?.greska ?? 'Nepoznata greška');
      },
    });
  }
}
