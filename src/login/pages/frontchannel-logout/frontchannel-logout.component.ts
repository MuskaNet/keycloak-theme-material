import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
  selector: 'kc-frontchannel-logout',
  templateUrl: 'frontchannel-logout.component.html',
  styleUrl: '../page-common.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => FrontchannelLogoutComponent),
    },
  ],
})
export class FrontchannelLogoutComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'frontchannel-logout.ftl' }>>(KC_LOGIN_CONTEXT);
  i18n = inject<I18n>(LOGIN_I18N);
  #sanitizer = inject(DomSanitizer);

  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

  documentTitle: string | undefined = this.i18n.msgStr('frontchannel-logout.title');
  bodyClassName: string | undefined;

  displayRequiredFields = false;
  displayInfo = false;
  displayMessage = false;

  headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
  infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
  socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

  readonly iframeLoadCount = signal(0);

  sanitizeUrl(url: string) {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  constructor() {
    super();
    effect(() => {
      const logout = this.kcContext.logout;
      if (!logout.logoutRedirectUri) return;
      // Redirect after all iframes have loaded
      if (this.iframeLoadCount() >= logout.clients.length) {
        window.location.replace(logout.logoutRedirectUri);
      }
    });
  }

  onIframeLoad() {
    this.iframeLoadCount.update((c) => c + 1);
  }
}
