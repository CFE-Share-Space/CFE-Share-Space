import { origin, type Config } from './core.ts';
const key = 'cfe-oauth';
// This static starter uses the implicit flow supported by the reference CFE.
// Confirm this flow and the exact redirect URL with Zooniverse before deployment.
export function token(): string {
  const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
  return saved && saved.expires > Date.now() ? saved.token : '';
}
export function callback() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (!params.has('access_token') && !params.has('error')) return;
  const expected = sessionStorage.getItem('cfe-state');
  sessionStorage.removeItem('cfe-state');
  history.replaceState(null, '', location.pathname + location.search);
  if (!expected || params.get('state') !== expected) throw new Error('Sign-in state did not match. Please try again.');
  if (params.has('error')) throw new Error('Zooniverse declined sign-in.');
  const lifetime = Number(params.get('expires_in'));
  if (!params.get('access_token') || !Number.isFinite(lifetime) || lifetime <= 0) throw new Error('Invalid sign-in response');
  sessionStorage.setItem(key, JSON.stringify({ token: params.get('access_token'), expires: Date.now() + lifetime * 1000 }));
}
export function login(config: Config) {
  const state = crypto.randomUUID(); sessionStorage.setItem('cfe-state', state);
  const url = new URL(origin(config.environment) + '/oauth/authorize');
  url.search = new URLSearchParams({ response_type: 'token', client_id: config.oauthClientId, redirect_uri: config.oauthRedirectUri, scope: config.oauthScope, state }).toString();
  location.assign(url);
}
export function logout() { sessionStorage.removeItem(key); location.reload(); }
