<p align="center">
  <i>🎨 Google Material 3 Keycloak Authentication Theme</i>
  <br/>
  <br/>
</p>

# Keycloak Material Theme

A Google Account-style authentication theme for Keycloak, built with **Angular 21**, **Angular Material 3 (M3)**, and **Keycloakify 11**. Designed to replace Keycloak's default login, registration, and account management pages with a modern, responsive Material Design experience.

> This project was primarily generated and refined with the assistance of **GitHub Copilot (AI)**. Most pages, styles, and interactions were implemented through AI-guided development in VS Code.

## Features

- **Material Design 3** with rose/pink primary palette, light/dark theme support
- **Responsive split-column card layout** — brand column left, content right, full-width stack on mobile
- **Custom component pages** covering the full authentication journey:

| Page                      | Keycloak Template                    |
| ------------------------- | ------------------------------------ |
| Login + Password          | `login.ftl`                          |
| Username-only login       | `login-username.ftl`                 |
| Password-only login       | `login-password.ftl`                 |
| Registration (multi-step) | `register.ftl`                       |
| Reset Password            | `login-reset-password.ftl`           |
| Update Password           | `login-update-password.ftl`          |
| OTP Login                 | `login-otp.ftl`                      |
| Configure TOTP (stepped)  | `login-config-totp.ftl`              |
| Passkey Registration      | `webauthn-register.ftl`              |
| Delete Credential         | `delete-credential.ftl`              |
| Info / Error / Terms      | `info.ftl`, `error.ftl`, `terms.ftl` |

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

- **Angular 21** — standalone components, signals, `@for` / `@if` control flow
- **Angular Material 3** — `mat-form-field`, mat-theme tokens
- **Keycloakify 11** — Keycloak theme packaging
- **Vite 8** — build tooling
- **Storybook 8** — component development
- **pnpm** — package manager
