import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference';
import type { I18n } from '@keycloakify/angular/account/i18n';
import type { KcContext } from '@keycloakify/angular/account/KcContext';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import type { ClassKey } from 'keycloakify/account/lib/kcClsx';

@Component({
  selector: 'kc-account',
  templateUrl: 'account.component.html',
  styleUrl: '../page-common.scss',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, KcSanitizePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => AccountComponent),
    },
  ],
})
export class AccountComponent extends ComponentReference {
  i18n = inject<I18n>(ACCOUNT_I18N);
  kcContext = inject<Extract<KcContext, { pageId: 'account.ftl' }>>(KC_ACCOUNT_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
  active = 'account';

  get initials(): string {
    const first = this.kcContext.account.firstName?.charAt(0) ?? '';
    const last = this.kcContext.account.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase() || 'U';
  }

  get fullName(): string {
    return [this.kcContext.account.firstName, this.kcContext.account.lastName].filter(Boolean).join(' ') || 'User';
  }
}
