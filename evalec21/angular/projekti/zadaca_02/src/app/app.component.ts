import { Component } from '@angular/core';
import { AuthService } from './servisi/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.trenutniKorisnik().subscribe({
      next: (r) => {
        this.auth.prijavljeniKorisnik.next(r);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
