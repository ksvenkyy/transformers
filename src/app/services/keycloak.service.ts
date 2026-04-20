import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://sso.dotnetdev.in',
  realm: 'sso-realm',
  clientId: 'frontend-app'
});

export async function initializeKeycloak() {
  const token = sessionStorage.getItem('kc_token') || undefined;
  const refreshToken = sessionStorage.getItem('kc_refreshToken') || undefined;
  const idToken = sessionStorage.getItem('kc_idToken') || undefined;

  keycloak.onAuthSuccess = () => {
    if (keycloak.token) sessionStorage.setItem('kc_token', keycloak.token);
    if (keycloak.refreshToken) sessionStorage.setItem('kc_refreshToken', keycloak.refreshToken);
    if (keycloak.idToken) sessionStorage.setItem('kc_idToken', keycloak.idToken);
  };

  keycloak.onAuthRefreshSuccess = () => {
    if (keycloak.token) sessionStorage.setItem('kc_token', keycloak.token);
    if (keycloak.refreshToken) sessionStorage.setItem('kc_refreshToken', keycloak.refreshToken);
    if (keycloak.idToken) sessionStorage.setItem('kc_idToken', keycloak.idToken);
  };

  keycloak.onAuthLogout = () => {
    sessionStorage.removeItem('kc_token');
    sessionStorage.removeItem('kc_refreshToken');
    sessionStorage.removeItem('kc_idToken');
  };

  const initialized = await keycloak.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    silentCheckSsoFallback: false,
    pkceMethod: 'S256',
    token,
    refreshToken,
    idToken
  });

  if (initialized) {
    if (keycloak.token) sessionStorage.setItem('kc_token', keycloak.token);
    if (keycloak.refreshToken) sessionStorage.setItem('kc_refreshToken', keycloak.refreshToken);
    if (keycloak.idToken) sessionStorage.setItem('kc_idToken', keycloak.idToken);
  }

  return initialized;
}

export function getKeycloak() {
  return keycloak;
}
