import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getKeycloak } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak = getKeycloak();

  constructor(private router: Router) { }

  get isLoggedIn(): boolean {
    return !!(this.keycloak.authenticated && this.keycloak.token && !this.isTokenExpired());
  }

  private isTokenExpired(): boolean {
    if (!this.keycloak.tokenParsed) return true;
    const expiresAt = this.keycloak.tokenParsed['exp'];
    if (!expiresAt) return true;
    return expiresAt * 1000 < Date.now();
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(30); // Refresh if expires in 30 seconds
      return refreshed;
    } catch (error) {
      console.error('Token refresh failed', error);
      return false;
    }
  }

  get token(): string | undefined {
    return this.keycloak.token;
  }

  get userProfile() {
    return this.keycloak.tokenParsed;
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }
}