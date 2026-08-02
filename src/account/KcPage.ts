import { getDefaultPageComponent, type KcPage } from '@keycloakify/angular/account';
import { TemplateComponent } from './template';
// Ensure oidc-spa early init runs on every account page: the silent sign-in
// iframe loads this page (redirect_uri) and must postMessage back to the
// parent, which only happens if oidcEarlyInit() has executed here.
import './oidc';
import type { ClassKey } from 'keycloakify/account/lib/kcClsx';
import type { KcContext } from './KcContext';

export const classes = {} satisfies Partial<Record<ClassKey, string>>;
export const doUseDefaultCss = false;

export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {
  switch (pageId) {
    case 'account.ftl':
      return {
        PageComponent: (await import('./pages/account/account.component')).AccountComponent,
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
    case 'password.ftl':
      return {
        PageComponent: (await import('./pages/password/password.component')).PasswordComponent,
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
    case 'totp.ftl':
      return {
        PageComponent: (await import('./pages/totp/totp.component')).TotpComponent,
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
    case 'sessions.ftl':
      return {
        PageComponent: (await import('./pages/sessions/sessions.component')).SessionsComponent,
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
    case 'applications.ftl':
      return {
        PageComponent: (await import('./pages/applications/applications.component')).ApplicationsComponent,
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
    case 'log.ftl':
      return {
        PageComponent: (await import('./pages/log/log.component')).LogComponent,
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
    case 'federatedIdentity.ftl':
      return {
        PageComponent: (await import('./pages/federatedIdentity/federatedIdentity.component'))
          .FederatedIdentityComponent,
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
    default:
      return {
        PageComponent: await getDefaultPageComponent(pageId),
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
  }
}
