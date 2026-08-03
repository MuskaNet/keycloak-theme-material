import { oidc } from '../oidc';
import { createKeycloakUtils } from 'oidc-spa/keycloak';

/**
 * Shapes returned by `GET /realms/{realm}/account/credentials`
 * (Account v3 REST API).
 */
export type UserCredential = {
  id: string;
  type: string;
  userLabel: string;
  createdDate?: number;
};

export type CredentialContainer = {
  type: string;
  category?: string;
  displayName?: string;
  helptext?: string;
  iconCssClass?: string;
  createAction?: string;
  updateAction?: string;
  removeable?: boolean;
  userCredentialMetadatas?: {
    credential: UserCredential;
    credentialMetadata?: { info?: string };
  }[];
  metadata?: Record<string, unknown>;
};

/**
 * Shape returned by `GET /realms/{realm}/account/applications`
 * (Account v3 REST API).
 */
export type RestClientRepresentation = {
  clientId: string;
  clientName: string;
  description: string;
  userConsentRequired: boolean;
  inUse: boolean;
  offlineAccess: boolean;
  rootUrl: string;
  baseUrl: string;
  effectiveUrl: string;
  consent?: {
    grantedScopes: { id: string; name: string; displayText: string }[];
    createdDate: number;
    lastUpdatedDate: number;
  };
  logoUri: string;
  policyUri: string;
  tosUri: string;
};

const credentialsMock: CredentialContainer[] = [
  {
    type: 'otp',
    category: 'two-factor',
    displayName: 'Mobile Authenticator',
    helptext: '',
    iconCssClass: '',
    createAction: 'CONFIGURE_TOTP',
    updateAction: null,
    removeable: true,
    userCredentialMetadatas: [
      {
        credential: { id: '1', type: 'otp', userLabel: 'My phone', createdDate: 1700000000000 },
        credentialMetadata: { info: '' },
      },
    ],
    metadata: {},
  },
  {
    type: 'webauthn',
    category: 'two-factor',
    displayName: 'Security Key',
    helptext: '',
    iconCssClass: '',
    createAction: 'webauthn-register',
    updateAction: null,
    removeable: true,
    userCredentialMetadatas: [
      {
        credential: { id: 'pk1', type: 'webauthn', userLabel: 'YubiKey 5', createdDate: 1700000000000 },
        credentialMetadata: { info: '' },
      },
      {
        credential: { id: 'pk2', type: 'webauthn', userLabel: 'Windows Hello', createdDate: 1700000000000 },
        credentialMetadata: { info: '' },
      },
    ],
    metadata: {},
  },
];

const applicationsMock: RestClientRepresentation[] = [
  {
    clientId: 'account',
    clientName: '${client_account}',
    description: '',
    userConsentRequired: false,
    inUse: true,
    offlineAccess: false,
    rootUrl: '${authBaseUrl}',
    baseUrl: '/realms/myrealm/account/',
    effectiveUrl: 'http://localhost:8080/realms/myrealm/account/',
    logoUri: '',
    policyUri: '',
    tosUri: '',
  },
  {
    clientId: 'account-console',
    clientName: '${client_account-console}',
    description: 'A sample third-party application',
    userConsentRequired: true,
    inUse: false,
    offlineAccess: false,
    rootUrl: '${authBaseUrl}',
    baseUrl: '',
    effectiveUrl: 'https://my-theme.keycloakify.dev',
    consent: {
      grantedScopes: [
        { id: '1', name: 'profile', displayText: 'User profile' },
        { id: '2', name: 'email', displayText: 'Email address' },
      ],
      createdDate: 1700000000000,
      lastUpdatedDate: 1700000000000,
    },
    logoUri: '',
    policyUri: '',
    tosUri: '',
  },
];

/**
 * Fetch the user's credentials (OTP, WebAuthn...) from the Account REST API.
 * This data is missing from the kcContext of the Multi-Page theme, so we
 * retrieve it dynamically. In DEV (Storybook) we return a mock.
 */
export async function getCredentials(): Promise<CredentialContainer[]> {
  if (import.meta.env.DEV) {
    return credentialsMock;
  }

  // oidc-spa's own silent-signin timeout is 25s (autoLogin) and can be longer
  // on slow connections; give it room to complete before we give up.
  const oidcInstance = await withTimeout(oidc, 40_000, 'Timed out waiting for oidc-spa initialization');
  const { accessToken } = await withTimeout(oidcInstance.getTokens(), 15_000, 'Timed out getting tokens');

  const { issuerUriParsed } = createKeycloakUtils({ issuerUri: oidcInstance.params.issuerUri });
  const { kcHttpRelativePath, realm } = issuerUriParsed;

  const response = await fetch(`${kcHttpRelativePath ?? ''}/realms/${realm}/account/credentials`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch credentials: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch the user's applications (with real clientId/clientName) from the
 * Account REST API. The kcContext of the Multi-Page theme deliberately omits
 * the `client` object, so we retrieve the actual client info dynamically.
 * In DEV (Storybook) we return a mock.
 */
export async function getApplications(): Promise<RestClientRepresentation[]> {
  if (import.meta.env.DEV) {
    return applicationsMock;
  }

  // oidc-spa's own silent-signin timeout is 25s (autoLogin) and can be longer
  // on slow connections; give it room to complete before we give up.
  const oidcInstance = await withTimeout(oidc, 40_000, 'Timed out waiting for oidc-spa initialization');
  const { accessToken } = await withTimeout(oidcInstance.getTokens(), 15_000, 'Timed out getting tokens');

  const { issuerUriParsed } = createKeycloakUtils({ issuerUri: oidcInstance.params.issuerUri });
  const { kcHttpRelativePath, realm } = issuerUriParsed;

  const response = await fetch(`${kcHttpRelativePath ?? ''}/realms/${realm}/account/applications`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.status}`);
  }

  return response.json();
}

/** Shared auth bootstrap for the Account REST API calls below. */
async function getAccessToken(): Promise<{ kcHttpRelativePath: string | undefined; realm: string; accessToken: string }> {
  // oidc-spa's own silent-signin timeout is 25s (autoLogin) and can be longer
  // on slow connections; give it room to complete before we give up.
  const oidcInstance = await withTimeout(oidc, 40_000, 'Timed out waiting for oidc-spa initialization');
  const { accessToken } = await withTimeout(oidcInstance.getTokens(), 15_000, 'Timed out getting tokens');

  const { issuerUriParsed } = createKeycloakUtils({ issuerUri: oidcInstance.params.issuerUri });
  return { ...issuerUriParsed, accessToken };
}

/**
 * Revoke the consent a user granted to an application.
 * `DELETE /realms/{realm}/account/applications/{clientId}/consent`
 */
export async function deleteConsent(clientId: string): Promise<void> {
  if (import.meta.env.DEV) {
    return;
  }

  const { kcHttpRelativePath, realm, accessToken } = await getAccessToken();

  const response = await fetch(
    `${kcHttpRelativePath ?? ''}/realms/${realm}/account/applications/${encodeURIComponent(clientId)}/consent`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to revoke consent: ${response.status}`);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}
