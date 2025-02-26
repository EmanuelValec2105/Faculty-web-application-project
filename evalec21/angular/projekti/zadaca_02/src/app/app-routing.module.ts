import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { OsobeComponent } from './osobe/osobe.component';
import { DetaljiComponent } from './detalji/detalji.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { DodavanjeComponent } from './dodavanje/dodavanje.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { TotpComponent } from './totp/totp.component';
import { PrijavaTotpComponent } from './prijava-totp/prijava-totp.component';
import { FilmoviComponent } from './filmovi/filmovi.component';

const routes: Routes = [
  { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  { path: 'pocetna', component: PocetnaComponent },
  { path: 'dokumentacija', component: DokumentacijaComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'prijava-totp', component: PrijavaTotpComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'osobe', component: OsobeComponent },
  { path: 'filmovi', component: FilmoviComponent },
  { path: 'detalji', component: DetaljiComponent },
  { path: 'dodavanje', component: DodavanjeComponent },
  { path: 'korisnici', component: KorisniciComponent },
  { path: 'totp', component: TotpComponent },
  { path: '**', redirectTo: '/prijava' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
