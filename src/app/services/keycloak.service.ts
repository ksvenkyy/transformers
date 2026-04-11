import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://sso.dotnetdev.in',
  realm: 'sso-realm',
  clientId: 'frontend-app'
});

export async function initializeKeycloak() {
  return keycloak.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    silentCheckSsoFallback: false,
    pkceMethod: 'S256'
  });
}

export function getKeycloak() {
  return keycloak;
}
