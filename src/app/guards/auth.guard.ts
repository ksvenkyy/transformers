import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
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

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {

    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // ✅ Step 1: Authentication check
    if (!this.authService.isLoggedIn) {
      try {
        const refreshed = await this.authService.refreshToken();
        if (!refreshed || !this.authService.isLoggedIn) {
          this.router.navigate(['/']);
          return false;
        }
      } catch {
        this.router.navigate(['/']);
        return false;
      }
    }

    // ✅ Step 2: Role check
    const requiredRoles = route.data['roles'] as string[];

    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = this.authService.getUserRoles(); // 👈 we’ll define this

      const hasRole = requiredRoles.some(role =>
        userRoles.includes(role)
      );

      if (!hasRole) {
        this.router.navigate(['/unauthorized']); // 🔥 key change
        return false;
      }
    }

    return true;
  }
}