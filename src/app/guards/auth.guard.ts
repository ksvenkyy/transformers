import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {

    // ✅ Step 1: Authentication check
    if (!this.authService.isLoggedIn) {
      try {
        const refreshed = await this.authService.refreshToken();
        if (!refreshed || !this.authService.isLoggedIn) {
          return this.router.createUrlTree(['/']);
        }
      } catch {
        return this.router.createUrlTree(['/']);
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
        return this.router.createUrlTree(['/unauthorized']); // 🔥 key change
      }
    }

    return true;
  }
}