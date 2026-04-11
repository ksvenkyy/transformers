import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.html',
})
export class UnauthorizedComponent {
  constructor(private router: Router) { }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
