<p align="center">
  <i>🎨 Google Material 3 Keycloak Authentication Theme</i>
  <br/>
  <br/>
</p>

# Keycloak Material Theme

A Google Account-style authentication theme for Keycloak, built with **Angular 21**, **Angular Material 3 (M3)**, and **Keycloakify 11**. Designed to replace Keycloak's default login and registration pages with a modern, responsive Material Design experience.

> This project was primarily generated and refined with the assistance of **GitHub Copilot (AI)**. Most pages, styles, and interactions were implemented through AI-guided development in VS Code.

## Features

- **Material Design 3** with rose/pink primary palette, light/dark theme support
- **Responsive split-column card layout** — brand column left, content right, full-width stack on mobile
- **Zoneless change detection** — Angular 21's zoneless mode for better performance
- **38 custom component pages** covering the full authentication journey:

| Page                             | Keycloak Template                             |
| -------------------------------- | --------------------------------------------- |
| Code                             | `code.ftl`                                    |
| Delete Account Confirm           | `delete-account-confirm.ftl`                  |
| Delete Credential                | `delete-credential.ftl`                       |
| Error                            | `error.ftl`                                   |
| Frontchannel Logout              | `frontchannel-logout.ftl`                     |
| IDP Review User Profile          | `idp-review-user-profile.ftl`                 |
| Info                             | `info.ftl`                                    |
| Link IDP Action                  | `link-idp-action.ftl`                         |
| Login                            | `login.ftl`                                   |
| Login Config TOTP                | `login-config-totp.ftl`                       |
| Login IDP Link Confirm           | `login-idp-link-confirm.ftl`                  |
| Login IDP Link Confirm Override  | `login-idp-link-confirm-override.ftl`         |
| Login IDP Link Email             | `login-idp-link-email.ftl`                    |
| Login OAuth Grant                | `login-oauth-grant.ftl`                       |
| Login OAuth2 Device Verify       | `login-oauth2-device-verify-user-code.ftl`    |
| Login OTP                        | `login-otp.ftl`                               |
| Login Page Expired               | `login-page-expired.ftl`                      |
| Login Passkeys Conditional       | `login-passkeys-conditional-authenticate.ftl` |
| Login Password                   | `login-password.ftl`                          |
| Login Recovery Authn Code Config | `login-recovery-authn-code-config.ftl`        |
| Login Recovery Authn Code Input  | `login-recovery-authn-code-input.ftl`         |
| Login Reset OTP                  | `login-reset-otp.ftl`                         |
| Login Reset Password             | `login-reset-password.ftl`                    |
| Login Update Password            | `login-update-password.ftl`                   |
| Login Update Profile             | `login-update-profile.ftl`                    |
| Login Username                   | `login-username.ftl`                          |
| Login Verify Email               | `login-verify-email.ftl`                      |
| Login X509 Info                  | `login-x509-info.ftl`                         |
| Logout Confirm                   | `logout-confirm.ftl`                          |
| Registration                     | `register.ftl`                                |
| SAML Post Form                   | `saml-post-form.ftl`                          |
| Select Authenticator             | `select-authenticator.ftl`                    |
| Select Organization              | `select-organization.ftl`                     |
| Terms                            | `terms.ftl`                                   |
| Update Email                     | `update-email.ftl`                            |
| WebAuthn Authenticate            | `webauthn-authenticate.ftl`                   |
| WebAuthn Error                   | `webauthn-error.ftl`                          |
| WebAuthn Register                | `webauthn-register.ftl`                       |

- **Passkey (WebAuthn) support** — Conditional UI on login, full credential registration flow
- **Font Awesome** social provider branding + **Material Icons** for actions
- **Global Material-themed scrollbar**
- **i18n-aware** — uses Keycloak's built-in message bundles

## Quick Start

```bash
pnpm install
```

## Development

```bash
pnpm start          # Dev server
pnpm storybook      # Component stories
```

## Lint & Build

```bash
pnpm lint                        # ESLint
pnpm build                       # Production build
pnpm build-keycloak-theme        # Build Keycloak theme .jar
```

Requires [Maven](https://maven.apache.org/) for `build-keycloak-theme`.

## Tech Stack

- **Angular 21** — standalone components, signals, `@for` / `@if` control flow, zoneless change detection
- **Angular Material 3** — `mat-form-field`, mat-theme tokens
- **Keycloakify 11** — Keycloak theme packaging (login theme only; account theme disabled)
- **Vite 8** — build tooling
- **Storybook 10** — component development
- **pnpm** — package manager (requires Node.js >= 24)
