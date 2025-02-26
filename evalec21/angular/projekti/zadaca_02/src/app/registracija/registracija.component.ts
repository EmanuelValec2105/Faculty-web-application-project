import { Component } from '@angular/core';
import { AuthService } from '../servisi/auth.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';

@Component({
  selector: 'app-registracija',
  standalone: false,

  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss',
})
export class RegistracijaComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private captcha: ReCaptchaV3Service
  ) {}

  registracija(
    email: string,
    korime: string,
    lozinka: string,
    ime: string,
    prezime: string,
    adresa: string
  ) {
    if (
      email == '' ||
      !email ||
      korime == '' ||
      !korime ||
      lozinka == '' ||
      !lozinka
    ) {
      alert('Email, korisničko ime i lozinka su obavezni podaci!');
      return;
    }
    this.captcha.execute('registracija').subscribe((token) =>
      this.auth.recaptcha(token).subscribe({
        next: (valid) => {
          this.auth
            .registracija(email, korime, lozinka, ime, prezime, adresa)
            .subscribe({
              next: (r) => {
                alert('Uspješna registracija! Molimo prijavite se.');
                this.router.navigate(['/prijava']);
              },
              error: (err) => {
                alert(err.error.greska || 'Greška prilikom registracije');
              },
            });
        },
        error: (error) => alert(error.error?.greska ?? 'Greška'),
      })
    );
  }
}
