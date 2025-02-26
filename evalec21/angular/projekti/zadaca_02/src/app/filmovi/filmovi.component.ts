import { Component } from '@angular/core';
import { FilmService } from '../servisi/film.service';
import { IFilm } from '../modeli/IFilm';

@Component({
  selector: 'app-filmovi',
  standalone: false,

  templateUrl: './filmovi.component.html',
  styleUrl: './filmovi.component.scss',
})
export class FilmoviComponent {
  constructor(private filmServis: FilmService) {}
  filmovi: Array<IFilm> = [];
  trenutnaStranica = 1;

  ngOnInit() {
    this.dohvati(this.trenutnaStranica);
  }

  async dohvati(stranica: number) {
    (await this.filmServis.dohvati(stranica)).subscribe(
      (r) => (this.filmovi = r)
    );
  }

  promjeniStranicu(stranica: number): void {
    if (stranica < 1 || stranica === this.trenutnaStranica) {
      return;
    }
    this.trenutnaStranica = stranica;
    this.dohvati(this.trenutnaStranica);
  }
}
