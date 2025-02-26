import { Component } from '@angular/core';
import { AuthService } from '../servisi/auth.service';
import { IKorisnik } from '../modeli/IKorisnik';

@Component({
  selector: 'app-totp',
  standalone: false,
  templateUrl: './totp.component.html',
  styleUrl: './totp.component.scss',
})
export class TotpComponent {
  constructor(private auth: AuthService) {}

  totpAktivan!: number;
  totpTajna!: string;
  korime!: string;
  ngOnInit() {
    this.dohvati();
  }

  dohvati() {
    this.auth.trenutniKorisnik().subscribe((r: IKorisnik) => {
      this.totpAktivan = r.totp_aktivan ?? 0;
      this.totpTajna = r.totp_tajna ?? '';
      this.korime = r.korime;
    });
  }

  async aktiviraj() {
    (await this.auth.totp(this.korime!, true)).subscribe({
      next: (r) => {
        alert('Uspjeh');
        this.dohvati();
      },
      error: (err) => {
        alert(err.error?.greska ?? 'Greška');
      },
    });
  }
  async deaktiviraj() {
    (await this.auth.totp(this.korime!, false)).subscribe({
      next: (r) => {
        alert('Uspjeh');
        this.dohvati();
      },
      error: (err) => {
        alert(err.error?.greska ?? 'Greška');
      },
    });
  }
}
