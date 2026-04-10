import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  async canActivate(): Promise<boolean> {
    // Skip auth check during SSR/prerendering
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // Check if authenticated with valid token
    if (this.authService.isLoggedIn) {
      return true;
    }

    // Try to refresh token
    try {
      const refreshed = await this.authService.refreshToken();
      if (refreshed && this.authService.isLoggedIn) {
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed', error);
    }

    // If still not authenticated, redirect to login
    this.router.navigate(['/']);
    return false;
  }
}