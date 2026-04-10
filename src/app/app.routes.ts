import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { TvSetupComponent } from './tv-setup/tv-setup.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tv-setup', component: TvSetupComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];
