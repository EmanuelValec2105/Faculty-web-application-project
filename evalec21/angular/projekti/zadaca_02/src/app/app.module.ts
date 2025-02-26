import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { NavigacijaComponent } from './navigacija/navigacija.component';
import { OsobeComponent } from './osobe/osobe.component';
import { FormsModule } from '@angular/forms';
import { DetaljiComponent } from './detalji/detalji.component';
import { DodavanjeComponent } from './dodavanje/dodavanje.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { TotpComponent } from './totp/totp.component';
import { PrijavaTotpComponent } from './prijava-totp/prijava-totp.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-2';
import { environment } from '../environments/environment.development';
import { FilmoviComponent } from './filmovi/filmovi.component';

@NgModule({
  declarations: [
    AppComponent,
    DokumentacijaComponent,
    PrijavaComponent,
    PocetnaComponent,
    NavigacijaComponent,
    OsobeComponent,
    DetaljiComponent,
    DodavanjeComponent,
    KorisniciComponent,
    RegistracijaComponent,
    TotpComponent,
    PrijavaTotpComponent,
    FilmoviComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    QRCodeComponent,
    RecaptchaV3Module,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
