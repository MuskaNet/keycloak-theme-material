import { NgTemplateOutlet } from '@angular/common';
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
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import type { Script } from '@keycloakify/angular/lib/models/script';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
  selector: 'kc-webauthn-register',
  templateUrl: 'webauthn-register.component.html',
  styleUrl: '../page-common.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    KcSanitizePipe,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => WebauthnRegisterComponent),
    },
  ],
})
export class WebauthnRegisterComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'webauthn-register.ftl' }>>(KC_LOGIN_CONTEXT);
  i18n = inject<I18n>(LOGIN_I18N);
  private readonly loginResourceInjectorService = inject(LoginResourceInjectorService);

  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

  documentTitle: string | undefined;
  bodyClassName: string | undefined;

  displayRequiredFields = false;
  displayInfo = false;
  displayMessage = true;

  headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
  infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
  socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

  isRegistering = signal(false);

  constructor() {
    super();
    afterNextRender(() => this.initializeWebAuthnRegistration());
  }

  private initializeWebAuthnRegistration(): void {
    const {
      url,
      challenge,
      userid,
      username,
      signatureAlgorithms,
      rpEntityName,
      rpId,
      attestationConveyancePreference,
      authenticatorAttachment,
      requireResidentKey,
      userVerificationRequirement,
      createTimeout,
      excludeCredentialIds,
    } = this.kcContext;

    const input = {
      challenge,
      userid,
      username,
      signatureAlgorithms,
      rpEntityName,
      rpId,
      attestationConveyancePreference,
      authenticatorAttachment,
      requireResidentKey,
      userVerificationRequirement,
      createTimeout: Number(createTimeout),
      excludeCredentialIds,
      initLabel: this.i18n.msgStr('webauthn-registration-title'),
      initLabelPrompt: this.i18n.msgStr('webauthn-registration-init-label-prompt'),
    };

    const scripts: Script[] = [
      {
        type: 'module',
        id: 'kc-webauthn-register',
        textContent: `
          import { registerByWebAuthn } from ${JSON.stringify(`${url.resourcesPath}/js/webauthnRegister.js`)};

          const authButton = document.getElementById('authenticateWebAuthnButton');
          const input = ${JSON.stringify(input)};

          authButton?.addEventListener('click', (event) => {
            event.preventDefault();
            registerByWebAuthn({
              ...input,
              errmsg: ${JSON.stringify(this.i18n.msgStr('webauthn-unsupported-browser-text'))}
            });
          });
        `,
      },
    ];

    this.loginResourceInjectorService.insertAdditionalScripts(scripts);
  }
}
