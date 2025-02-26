import { Component } from '@angular/core';
import { AuthService } from '../servisi/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prijava-totp',
  standalone: false,

  templateUrl: './prijava-totp.component.html',
  styleUrl: './prijava-totp.component.scss',
})
export class PrijavaTotpComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  prijava(totp: string) {
    let korime = this.route.snapshot.queryParamMap.get('korime')!;
    this.auth.prijavaTotp(totp, korime).subscribe({
      next: (r) => {
        this.auth.prijavljeniKorisnik.next(r);
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error?.greska ?? 'Greška!');
      },
    });
  }
}
