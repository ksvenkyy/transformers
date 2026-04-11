import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://sso.dotnetdev.in',
  realm: 'sso-realm',
  clientId: 'frontend-app'
});

export async function initializeKeycloak() {
  return keycloak.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
    checkLoginIframe: true   // Enable iframe checking for token refresh
  });
}

export function getKeycloak() {
  return keycloak;
}
