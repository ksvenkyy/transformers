import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { TvSetupComponent } from './tv-setup/tv-setup.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tv-setup', component: TvSetupComponent },
  { path: '**', redirectTo: '' },
];
