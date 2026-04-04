import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected username = '';
  protected password = '';
  protected rememberMe = true;
  protected showPassword = false;
  protected statusMessage = '';

  constructor(private readonly router: Router) {}

  protected onSubmit(): void {
    const u = this.username.trim();
    if (!u || !this.password) {
      this.statusMessage = 'Please enter a username and password.';
      return;
    }

    // Demo-only login: navigate to dashboard.
    void this.router.navigateByUrl('/dashboard');
  }

  protected useDemoCredentials(): void {
    this.username = 'player1';
    this.password = 'letmein';
    this.statusMessage = '';
  }
}

