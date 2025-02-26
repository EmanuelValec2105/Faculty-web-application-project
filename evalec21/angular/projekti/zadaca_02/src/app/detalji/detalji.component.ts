import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OsobeService } from '../servisi/osobe.service';
import { IOsobaDetalji } from '../modeli/IOsobaDetalji';

@Component({
  selector: 'app-detalji',
  standalone: false,

  templateUrl: './detalji.component.html',
  styleUrl: './detalji.component.scss',
})
export class DetaljiComponent {
  id: string | null = '';
  trenutnaStranicaFilmova = 1;
  osoba!: IOsobaDetalji;
  prikaziDodajJos = true;
  prikazaniOpis: string | null = null;

  prikaziOpis(opis: string): void {
    this.prikazaniOpis = opis;
  }

  sakrijOpis(): void {
    this.prikazaniOpis = null;
  }
  constructor(
    private route: ActivatedRoute,
    private osobeServis: OsobeService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('id');
    if (this.id == null) {
      this.router.navigate(['/osobe']);
    }
    (await this.osobeServis.dohvatiDetaljeOsobe(this.id!)).subscribe((r) => {
      console.log(r);
      this.osoba = r;
    });
  }

  prikaziVelikuSliku(slika: string) {
    window.open(slika, '_blank');
  }

  async ucitajJos() {
    this.trenutnaStranicaFilmova++;
    (
      await this.osobeServis.dohvatiFilmove(
        this.osoba.id.toString(),
        this.trenutnaStranicaFilmova
      )
    ).subscribe((r) => {
      console.log(r);
      if (r.length == 0) {
        this.prikaziDodajJos = false;
      } else this.osoba.filmovi = this.osoba.filmovi.concat(r);
    });
  }
}
