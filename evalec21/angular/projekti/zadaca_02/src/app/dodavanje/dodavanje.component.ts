import { Component } from '@angular/core';
import { OsobeService } from '../servisi/osobe.service';
import { IPretragaRezultat } from '../modeli/IPretragaRezultat';

@Component({
  selector: 'app-dodavanje',
  standalone: false,

  templateUrl: './dodavanje.component.html',
  styleUrl: './dodavanje.component.scss',
})
export class DodavanjeComponent {
  constructor(private osobeServis: OsobeService) {}
  osobe: Array<IPretragaRezultat> | null = null;
  pojam = '';

  async pretraziOsobe() {
    if (!this.pojam || this.pojam == '') {
      alert('Unesite pojam za pretragu');
      return;
    }

    (await this.osobeServis.pretraziOsobe(this.pojam)).subscribe(
      (r) => (this.osobe = r)
    );
  }

  async dodajOsobu(id: number) {
    (await this.osobeServis.dodajOsobu(id)).subscribe({
      next: (r) => {
        this.pojam = '';
        this.osobe = [];
        alert('Osoba uspješno dodana!');
      },
      error: (err) => {
        alert(err.error?.greska ?? 'Greška prilikom dodavanja osobe');
      },
    });
  }

  async makniOsobu(id: number) {
    (await this.osobeServis.makniOsobu(id)).subscribe({
      next: (r) => {
        alert('Osoba uspješno maknuta');

        this.pojam = '';
        this.osobe = [];
      },
      error: (err) => {
        alert(err.error?.greska ?? 'Greška prilikom makivanja osobe');
      },
    });
  }
}
