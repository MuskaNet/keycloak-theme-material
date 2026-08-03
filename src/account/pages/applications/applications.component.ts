import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, signal, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference';
import type { I18n } from '@keycloakify/angular/account/i18n';
import type { KcContext } from '@keycloakify/angular/account/KcContext';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { IsArrayWithEmptyObjectPipe } from '@keycloakify/angular/lib/pipes/is-array-with-empty-object';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import type { ClassKey } from 'keycloakify/account/lib/kcClsx';
import { deleteConsent, getApplications, type RestClientRepresentation } from '../../lib/account-api';

type ApplicationsContext = Extract<KcContext, { pageId: 'applications.ftl' }>;

type KcApplication = NonNullable<NonNullable<ApplicationsContext['applications']>['applications']>[number];

/** REST API data (primary) merged with the kcContext fields the REST API lacks. */
export type EnrichedApplication = {
  /** Primary fields from the REST API. */
  clientId: string;
  clientName: string;
  description: string;
  userConsentRequired: boolean;
  inUse: boolean;
  offlineAccess: boolean;
  effectiveUrl: string;
  grantedScopes: { id: string; name: string; displayText: string }[];
  /** kcContext supplement (not exposed by the REST API). */
  clientScopesGranted: string[];
  additionalGrants: string[];
  realmRolesAvailable: KcApplication['realmRolesAvailable'];
  resourceRolesAvailable: KcApplication['resourceRolesAvailable'];
};

const emptyRealmRoles: KcApplication['realmRolesAvailable'] = [];

@Component({
  selector: 'kc-applications',
  templateUrl: 'applications.component.html',
  styleUrls: ['../page-common.scss', 'applications.component.scss'],
  imports: [KeyValuePipe, IsArrayWithEmptyObjectPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => ApplicationsComponent),
    },
  ],
})
export class ApplicationsComponent extends ComponentReference implements OnInit {
  i18n = inject<I18n>(ACCOUNT_I18N);
  kcContext = inject<ApplicationsContext>(KC_ACCOUNT_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
  active = 'applications';

  /** Raw REST API response (loaded once). */
  private restApps = signal<RestClientRepresentation[]>([]);

  /** True while the REST fetch is in-flight. */
  loading = signal(true);

  /** Index of the card whose grant details are expanded (null = all collapsed). */
  expandedCard = signal<number | null>(null);

  toggleCard(index: number): void {
    this.expandedCard.set(this.expandedCard() === index ? null : index);
  }

  /** REST API is the sole source; empty until the fetch completes. */
  applications = computed<EnrichedApplication[]>(() => {
    const kcApps = this.kcContext.applications?.applications ?? [];
    const restApps = this.restApps();

    if (restApps.length === 0) {
      return [];
    }

    const kcLookup = new Map<string, KcApplication>();
    for (const kcApp of kcApps) {
      if (kcApp.effectiveUrl) {
        kcLookup.set(kcApp.effectiveUrl, kcApp);
      }
    }

    return restApps.map((rest) => {
      const kcApp = rest.effectiveUrl ? kcLookup.get(rest.effectiveUrl) : undefined;
      return {
        clientId: rest.clientId,
        clientName: rest.clientName,
        description: rest.description,
        userConsentRequired: rest.userConsentRequired,
        inUse: rest.inUse,
        offlineAccess: rest.offlineAccess,
        effectiveUrl: rest.effectiveUrl,
        grantedScopes: rest.consent?.grantedScopes ?? [],
        clientScopesGranted: kcApp?.clientScopesGranted ?? [],
        additionalGrants: kcApp?.additionalGrants ?? [],
        realmRolesAvailable: kcApp?.realmRolesAvailable ?? emptyRealmRoles,
        resourceRolesAvailable: kcApp?.resourceRolesAvailable ?? {},
      };
    });
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const apps = await getApplications();
      this.restApps.set(apps);
    } catch (error) {
      console.error('[applications] Failed to fetch app data from REST API:', error);
    } finally {
      this.loading.set(false);
    }
  }

  /** Display name: clientName (i18n) → clientId (i18n) → hostname from URL → fallback. */
  displayName(app: EnrichedApplication): string {
    if (app.clientName || app.clientId) {
      return this.i18n.advancedMsgStr(app.clientName || app.clientId);
    }
    if (!app.effectiveUrl) {
      return this.i18n.msgStr('unknownApplication');
    }
    try {
      return new URL(app.effectiveUrl).hostname;
    } catch {
      return app.effectiveUrl;
    }
  }

  /** True when a revoke request is in-flight for this clientId. */
  revokingClientId = signal<string | null>(null);

  async revoke(app: EnrichedApplication): Promise<void> {
    this.revokingClientId.set(app.clientId);
    try {
      await deleteConsent(app.clientId);
      // Success: re-fetch to drop the revoked application.
      this.restApps.set(await getApplications());
    } catch (error) {
      console.error('[applications] Failed to revoke consent:', error);
    } finally {
      this.revokingClientId.set(null);
    }
  }
}
