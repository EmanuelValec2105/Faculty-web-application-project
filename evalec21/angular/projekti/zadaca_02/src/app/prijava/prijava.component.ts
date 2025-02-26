import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../servisi/auth.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';

@Component({
  selector: 'app-prijava',
  standalone: false,
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss',
})
export class PrijavaComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private captcha: ReCaptchaV3Service
  ) {}
  greska = '';
  public prijava(korime: string, lozinka: string) {
    this.captcha.execute('prijava').subscribe((token) =>
      this.auth.recaptcha(token).subscribe({
        next: (valid) => {
          this.greska = '';
          this.auth.prijava(korime, lozinka).subscribe({
            next: (r) => {
              console.log(r);
              if (r.totp_aktivan == 1) {
                this.router.navigate(['/prijava-totp'], {
                  queryParams: { korime },
                });
                return;
              }
              this.auth.prijavljeniKorisnik.next(r);
              this.router.navigate(['/']);
            },
            error: (e) => {
              this.greska = e.error?.greska ?? 'Nepoznata greška';
            },
          });
        },
        error: (err) => alert(err.error?.greska ?? 'Greška'),
      })
    );
  }
}
