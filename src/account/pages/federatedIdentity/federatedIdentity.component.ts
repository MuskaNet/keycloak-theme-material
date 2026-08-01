import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference';
import type { I18n } from '@keycloakify/angular/account/i18n';
import type { KcContext } from '@keycloakify/angular/account/KcContext';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import type { ClassKey } from 'keycloakify/account/lib/kcClsx';

@Component({
  selector: 'kc-federated-identity',
  templateUrl: 'federatedIdentity.component.html',
  styleUrl: '../page-common.scss',
  imports: [NgClass, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => FederatedIdentityComponent),
    },
  ],
})
export class FederatedIdentityComponent extends ComponentReference {
  i18n = inject<I18n>(ACCOUNT_I18N);
  kcContext = inject<Extract<KcContext, { pageId: 'federatedIdentity.ftl' }>>(KC_ACCOUNT_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
  active = 'social';

  // providerId → FontAwesome icon class (same convention as the login theme)
  private readonly providerIconClasses: Record<string, string> = {
    github: 'fa fa-github',
    google: 'fa fa-google',
    microsoft: 'fa fa-windows',
    facebook: 'fa fa-facebook',
    twitter: 'fa fa-twitter',
    gitlab: 'fa fa-gitlab',
    bitbucket: 'fa fa-bitbucket',
    stackoverflow: 'fa fa-stack-overflow',
    paypal: 'fa fa-paypal',
    instagram: 'fa fa-instagram',
    linkedin: 'fa fa-linkedin',
    apple: 'fa fa-apple',
    amazon: 'fa fa-amazon',
    slack: 'fa fa-slack',
    wechat: 'fa fa-weixin',
    weixin: 'fa fa-weixin',
    'openshift-v4': 'fa fa-cloud',
  };

  getIconClass(providerId: string): string | undefined {
    return this.providerIconClasses[providerId.toLowerCase()];
  }
}
