import { createOidc } from 'oidc-spa';
import { createMockOidc } from 'oidc-spa/mock';
import { oidcEarlyInit } from 'oidc-spa/entrypoint';

/**
 * OIDC client used to obtain an access token for the Account REST API.
 *
 * - DEV (Storybook / local dev server): a mock OIDC that considers the user
 *   logged in, so pages can be previewed without a running Keycloak.
 * - PROD: the real `account-console` client of the Keycloak instance serving
 *   this theme. The user is already authenticated (the Account Console pages
 *   are only served to logged-in users), so `autoLogin` resolves silently.
 */
export const oidc = (() => {
  if (import.meta.env.DEV) {
    return createMockOidc({
      isUserInitiallyLoggedIn: true,
      autoLogin: true,
      BASE_URL: import.meta.env.BASE_URL,
    });
  }

  const [kcHttpRelativePath, startsWithRealm] = window.location.pathname.split('/realms/');
  const realm = startsWithRealm.split('/')[0];

  const BASE_URL = `${kcHttpRelativePath}/realms/${realm}/account/`;

  // Without the oidc-spa Vite plugin, `createOidc` would await a promise that
  // only `oidcEarlyInit()` resolves, causing it to hang forever.
  oidcEarlyInit({ BASE_URL });

  return createOidc({
    issuerUri: `${window.location.origin}${kcHttpRelativePath}/realms/${realm}`,
    clientId: 'account-console',
    autoLogin: true,
    sessionRestorationMethod: 'auto',
    BASE_URL,
  });
})();
