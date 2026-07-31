import { getDefaultPageComponent, type KcPage } from '@keycloakify/angular/login';
import { UserProfileFormFieldsComponent } from './components/user-profile-form-fields';
import { TemplateComponent } from './template';
import type { ClassKey } from 'keycloakify/login';
import type { KcContext } from './KcContext';

export const classes = {} satisfies Partial<Record<ClassKey, string>>;
export const doUseDefaultCss = false;
export const doMakeUserConfirmPassword = true;

export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {
  switch (pageId) {
    case 'login.ftl':
      return {
        PageComponent: (await import('./pages/login/login.component')).LoginComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'info.ftl':
      return {
        PageComponent: (await import('./pages/info/info.component')).InfoComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'error.ftl':
      return {
        PageComponent: (await import('./pages/error/error.component')).ErrorComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'terms.ftl':
      return {
        PageComponent: (await import('./pages/terms/terms.component')).TermsComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'delete-credential.ftl':
      return {
        PageComponent: (await import('./pages/delete-credential/delete-credential.component'))
          .DeleteCredentialComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'login-reset-password.ftl':
      return {
        PageComponent: (await import('./pages/login-reset-password/login-reset-password.component'))
          .LoginResetPasswordComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'login-otp.ftl':
      return {
        PageComponent: (await import('./pages/login-otp/login-otp.component')).LoginOtpComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'login-username.ftl':
      return {
        PageComponent: (await import('./pages/login-username/login-username.component')).LoginUsernameComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'login-password.ftl':
      return {
        PageComponent: (await import('./pages/login-password/login-password.component')).LoginPasswordComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'login-update-password.ftl':
      return {
        PageComponent: (await import('./pages/login-update-password/login-update-password.component'))
          .LoginUpdatePasswordComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'webauthn-register.ftl':
      return {
        PageComponent: (await import('./pages/webauthn-register/webauthn-register.component'))
          .WebauthnRegisterComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'login-config-totp.ftl':
      return {
        PageComponent: (await import('./pages/login-config-totp/login-config-totp.component')).LoginConfigTotpComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    case 'register.ftl':
      return {
        PageComponent: (await import('./pages/register/register.component')).RegisterComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    default:
      return {
        PageComponent: await getDefaultPageComponent(pageId),
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
  }
}
