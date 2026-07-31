import { NgClass, NgTemplateOutlet } from '@angular/common';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import type { Script } from '@keycloakify/angular/lib/models/script';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
  selector: 'kc-login',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgTemplateOutlet,
    KcSanitizePipe,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginComponent),
    },
  ],
})
export class LoginComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login.ftl' }>>(KC_LOGIN_CONTEXT);
  i18n = inject<I18n>(LOGIN_I18N);
  private readonly loginResourceInjectorService = inject(LoginResourceInjectorService);

  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

  documentTitle: string | undefined;
  bodyClassName: string | undefined;

  displayRequiredFields = false;
  displayInfo =
    !!this.kcContext?.realm?.password &&
    !!this.kcContext?.realm?.registrationAllowed &&
    !this.kcContext?.registrationDisabled;
  displayMessage =
    this.kcContext.message?.type === 'error' || !this.kcContext?.messagesPerField?.existsError('username', 'password');

  headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
  infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
  socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

  isLoginButtonDisabled = signal(false);
  isPasswordVisible = signal(false);
  rememberMeChecked = signal(!!this.kcContext?.login?.rememberMe);

  constructor() {
    super();

    if (this.kcContext.enableWebAuthnConditionalUI !== true) {
      return;
    }

    afterNextRender(() => this.initializePasskeyLogin());
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  private initializePasskeyLogin(): void {
    const { url, challenge, userVerification, rpId, createTimeout, isUserIdentified } = this.kcContext;
    const input = JSON.stringify({
      isUserIdentified: isUserIdentified === 'true',
      challenge,
      userVerification,
      rpId,
      createTimeout: Number(createTimeout),
    });
    const scripts: Script[] = [
      {
        type: 'module',
        id: 'kc-login-passkey-conditional-auth',
        textContent: `
          import { authenticateByWebAuthn } from ${JSON.stringify(`${url.resourcesPath}/js/webauthnAuthenticate.js`)};
          import { initAuthenticate } from ${JSON.stringify(`${url.resourcesPath}/js/passkeysConditionalAuth.js`)};

          const authButton = document.getElementById('authenticateWebAuthnButton');
          const input = ${input};

          authButton?.addEventListener('click', () => {
            authenticateByWebAuthn({
              ...input,
              errmsg: ${JSON.stringify(this.i18n.msgStr('webauthn-unsupported-browser-text'))}
            });
          });

          initAuthenticate({
            ...input,
            errmsg: ${JSON.stringify(this.i18n.msgStr('passkey-unsupported-browser-text'))}
          });
        `,
      },
    ];

    this.loginResourceInjectorService.insertAdditionalScripts(scripts);
  }
}
