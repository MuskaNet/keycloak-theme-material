/**
 * Builds an Application Initiated Required Action (AIA) URL.
 *
 * The Account Console (v3) triggers login-theme pages (update-password,
 * config-totp, delete-credential, idp-link...) by redirecting to the OIDC
 * authorization endpoint with a `kc_action` query parameter. Keycloak then
 * renders the corresponding page from the login theme using the existing
 * authenticated session, and redirects back to `redirect_uri` once done.
 *
 * @param accountUrl  kcContext.url.accountUrl (e.g. "/realms/my-realm/account")
 * @param kcAction    e.g. "UPDATE_PASSWORD", "CONFIGURE_TOTP",
 *                    "delete_credential:123", "idp_link:github"
 * @param redirectUri URL to return to after the action completes.
 *                    Defaults to the account page itself.
 */
export function buildKcActionUrl(accountUrl: string, kcAction: string, redirectUri?: string): string {
  if (!accountUrl || accountUrl === '#') {
    return '#';
  }

  const baseUrl = new URL(accountUrl, window.location.href);

  const realmMatch = baseUrl.pathname.match(/^(\/realms\/[^/]+)/);
  if (!realmMatch) {
    return '#';
  }

  const authUrl = new URL(`${realmMatch[1]}/protocol/openid-connect/auth`, baseUrl.origin);
  const defaultRedirectUri = new URL(baseUrl.origin);
  defaultRedirectUri.pathname = baseUrl.pathname;

  authUrl.searchParams.set('client_id', 'account');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid');
  authUrl.searchParams.set('redirect_uri', redirectUri ?? defaultRedirectUri.href);
  authUrl.searchParams.set('kc_action', kcAction);

  return authUrl.toString();
}
