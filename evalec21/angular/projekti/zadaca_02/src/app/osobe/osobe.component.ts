import { Component } from '@angular/core';
import { AuthService } from '../servisi/auth.service';
import { OsobeService } from '../servisi/osobe.service';
import { IOsoba } from '../modeli/IOsoba';
import { Router } from '@angular/router';

@Component({
  selector: 'app-osobe',
  standalone: false,

  templateUrl: './osobe.component.html',
  styleUrl: './osobe.component.scss',
})
export class OsobeComponent {
  constructor(private router: Router, private osobeServis: OsobeService) {}

  trenutnaStranica = 1;
  brojPoStranici = 10;
  osobe: Array<IOsoba> = [];

  ngOnInit() {
    this.dohvatiOsobe();
  }

  resetirajStranicu() {
    this.trenutnaStranica = 1;
    this.dohvatiOsobe();
  }

  async dohvatiOsobe() {
    (
      await this.osobeServis.dohvatiOsobe(
        this.trenutnaStranica,
        this.brojPoStranici
      )
    ).subscribe((r) => (this.osobe = r));
  }

  prikaziDetalje(id: number) {
    this.router.navigate(['/detalji'], { queryParams: { id } });
  }

  promjeniStranicu(stranica: number): void {
    if (stranica < 1 || stranica === this.trenutnaStranica) {
      return;
    }
    this.trenutnaStranica = stranica;
    this.dohvatiOsobe();
  }
}
