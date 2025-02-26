export interface IKorisnik {
  adresa: string | null;
  email: string;
  id: number;
  ime: string | null;
  korime: string;
  lozinka: string;
  prezime: string | null;
  tip_korisnika_id: number;
  uloga: string;
  totp_aktivan: number | null;
  totp_tajna: string | null;
  ima_pristup: number | null;
  zatrazio_pristup: number | null;
}
