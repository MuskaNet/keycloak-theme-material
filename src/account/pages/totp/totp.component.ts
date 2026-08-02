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
import { buildKcActionUrl } from '../../lib/kc-action';

@Component({
  selector: 'kc-totp',
  templateUrl: 'totp.component.html',
  styleUrl: '../page-common.scss',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => TotpComponent),
    },
  ],
})
export class TotpComponent extends ComponentReference {
  i18n = inject<I18n>(ACCOUNT_I18N);
  kcContext = inject<Extract<KcContext, { pageId: 'totp.ftl' }>>(KC_ACCOUNT_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
  active = 'totp';

  /**
   * TOTP setup/removal is handled by the login theme through Application
   * Initiated Actions: "CONFIGURE_TOTP" (login-config-totp.ftl) and
   * "delete_credential:{id}" (delete-credential.ftl).
   */
  getKcActionUrl(kcAction: string): string {
    return buildKcActionUrl(this.kcContext.url.accountUrl, kcAction);
  }
}
