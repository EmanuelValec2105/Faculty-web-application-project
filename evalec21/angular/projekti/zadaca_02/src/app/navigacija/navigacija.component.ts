import { Component } from '@angular/core';
import { AuthService } from '../servisi/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigacija',
  standalone: false,

  templateUrl: './navigacija.component.html',
  styleUrl: './navigacija.component.scss',
})
export class NavigacijaComponent {
  constructor(private auth: AuthService, private router: Router) {}
  jePrijavljen = false;
  jeAdmin = false;
  ngOnInit() {
    this.auth.prijavljeniKorisnik.subscribe((r) => {
      if (r != null) {
        this.jePrijavljen = true;
        if (r?.tip_korisnika_id == 1) {
          this.jeAdmin = true;
        } else {
          this.jeAdmin = false;
        }
      } else {
        this.jePrijavljen = false;
        this.jeAdmin = false;
      }
    });
  }

  odjava() {
    this.auth.odjava().subscribe((a) => {
      this.auth.prijavljeniKorisnik.next(null);
      this.router.navigate(['/prijava']);
    });
  }
}
