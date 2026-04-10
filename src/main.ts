import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeKeycloak } from './app/keycloak.service';

initializeKeycloak().then(() => {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
}).catch((err) => console.error('Keycloak initialization failed', err));

const redirect = sessionStorage['redirect'];
if (redirect) {
  sessionStorage.removeItem('redirect');
  window.history.replaceState(null, '', redirect);
}