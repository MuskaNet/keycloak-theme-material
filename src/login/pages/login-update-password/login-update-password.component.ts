import { NgTemplateOutlet } from '@angular/common';
import {
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
import { MatInputModule } from '@angular/material/input';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
  selector: 'kc-login-update-password',
  templateUrl: 'login-update-password.component.html',
  styleUrl: '../login/login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, KcSanitizePipe, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule],
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginUpdatePasswordComponent),
    },
  ],
})
export class LoginUpdatePasswordComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-update-password.ftl' }>>(KC_LOGIN_CONTEXT);
  i18n = inject<I18n>(LOGIN_I18N);

  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

  documentTitle: string | undefined;
  bodyClassName: string | undefined;

  displayRequiredFields = false;
  displayInfo = false;
  displayMessage =
    this.kcContext.message?.type === 'error' ||
    !this.kcContext.messagesPerField.existsError('password', 'password-confirm');

  headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
  infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
  socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

  isNewPasswordVisible = signal(false);
  isConfirmPasswordVisible = signal(false);

  toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible.update((visible) => !visible);
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible.update((visible) => !visible);
  }

  handleEnter(event: Event, buttonId: string): void {
    event.preventDefault();
    document.getElementById(buttonId)?.click();
  }
}
