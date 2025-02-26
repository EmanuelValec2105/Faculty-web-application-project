import { IFilm } from './IFilm';

export interface IOsobaDetalji {
  filmovi: Array<IFilm>;
  galerija: Array<{
    slika_url: string | null;
  }>;
  id: number;
  ime: string;
  popularnost: number;
  poznat_po: string;
  slika: string;
}
