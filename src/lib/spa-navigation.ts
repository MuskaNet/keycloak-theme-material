import type { ApplicationRef } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { appConfig } from '../app.config';
import { bootstrapKcApplication, type KcContext } from '../kc.gen';

let appRef: ApplicationRef | undefined;
let progressEl: HTMLDivElement | undefined;
let hasSpaNavigationListener = false;

/** Registered by main.ts after the initial bootstrap. */
export function setSpaAppRef(ref: ApplicationRef | undefined): void {
  appRef = ref;
}

function ensureProgressEl(): HTMLDivElement {
  if (progressEl) {
    return progressEl;
  }

  progressEl = document.createElement('div');
  progressEl.className = 'kc-spa-progress';
  progressEl.innerHTML = '<div class="bar1"></div><div class="bar2"></div>';
  document.body.appendChild(progressEl);

  return progressEl;
}

function showProgress(): void {
  ensureProgressEl().classList.add('active');
}

function hideProgress(): void {
  ensureProgressEl().classList.remove('active');
}

/**
 * Runs the same inline <script> that the server-rendered page executes on
 * load. It defines `window.kcContext` (including keycloakify enhancements
 * like `messagesPerField.existsError`), which is all the next page needs.
 */
function extractKcContext(html: string): KcContext | undefined {
  const scriptBlocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];

  for (const [, code] of scriptBlocks) {
    if (!code.includes('window.kcContext')) {
      continue;
    }

    try {
      new Function(code)();
      return window.kcContext as KcContext;
    } catch (error) {
      console.error('[spa-navigation] Failed to evaluate kcContext script:', error);
      return undefined;
    }
  }

  return undefined;
}

async function rebootstrap(kcContext: KcContext): Promise<void> {
  // The new app renders into an off-screen host first. The old page stays on
  // screen until the new one has actually rendered content, then we swap the
  // hosts and destroy the old app — no blank flash in between.
  const nextHost = document.createElement('kc-root');
  nextHost.setAttribute('aria-hidden', 'true');
  nextHost.style.cssText =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; visibility: hidden; pointer-events: none;';
  document.body.appendChild(nextHost);

  const oldAppRef = appRef;
  const nextAppRef = await bootstrapKcApplication({
    kcContext,
    bootstrapApplication: async ({ KcRootComponent, kcProvider }) => {
      const appRef = await createApplication({
        providers: [...appConfig.providers, kcProvider],
      });
      // Bootstrap onto the explicit off-screen host instead of the default
      // `kc-root` selector, which would grab (and wipe) the visible page.
      appRef.bootstrap(KcRootComponent, nextHost);
      return appRef;
    },
  });

  // Wait until the new app has actually rendered content into the hidden
  // host (change detection, page component creation, and first paint).
  await waitForContent(nextHost, nextAppRef);

  oldAppRef?.destroy();
  nextHost.style.cssText = '';
  nextHost.removeAttribute('aria-hidden');
  appRef = nextAppRef;
}

/** Resolves once `host` has rendered content, or after a safety timeout. */
async function waitForContent(host: HTMLElement, appRef: ApplicationRef): Promise<void> {
  const startedAt = Date.now();
  const deadline = startedAt + 5_000;

  while (Date.now() < deadline) {
    await appRef.whenStable().catch(() => undefined);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    if (host.querySelector('*')) {
      return;
    }
  }

  console.warn('[spa-navigation] New page did not render within 5s, swapping anyway.');
}

async function navigateRequest(url: string, init?: RequestInit): Promise<void> {
  showProgress();

  try {
    const response = await fetch(url, {
      ...init,
      headers: { Accept: 'text/html', ...init?.headers },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const kcContext = extractKcContext(html);

    if (!kcContext || (kcContext.themeType !== 'account' && kcContext.themeType !== 'login')) {
      throw new Error('Target page is not a keycloakify page');
    }

    window.history.pushState({}, '', url);
    await rebootstrap(kcContext);
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('[spa-navigation] Falling back to full page load:', error);
    window.location.href = url;
  } finally {
    hideProgress();
  }
}

export async function navigateTo(url: string): Promise<void> {
  await navigateRequest(url);
}

/** Handles browser back/forward after a pushState navigation. */
export function initSpaPopstateHandler(): void {
  window.addEventListener('popstate', () => {
    void navigateTo(window.location.href);
  });
}

/**
 * Registers the document-level click interceptor (once). Both the login and
 * account template components call this; SPA navigation re-bootstraps them,
 * so the listener is intentionally never removed.
 */
export function initSpaNavigation(): void {
  if (hasSpaNavigationListener) {
    return;
  }
  hasSpaNavigationListener = true;
  document.addEventListener('click', onDocumentClick, true);
  document.addEventListener('submit', onDocumentSubmit, true);
}

function onDocumentClick(event: MouseEvent): void {
  if (event.defaultPrevented || event.button !== 0) {
    return;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const anchor = (event.target as Element | null)?.closest?.('a');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

  const url = new URL(href, window.location.href);
  if (!isSameSpaHost(url) || url.origin !== window.location.origin) return;

  if (isIdentityLinkAction(url)) return;
  if (isAuthenticationRedirect(url) && !url.searchParams.has('kc_action')) return;

  const realmPath = window.location.pathname.match(/^(\/realms\/[^/]+)/)?.[1];
  if (!realmPath || !url.pathname.startsWith(realmPath)) return;

  event.preventDefault();
  void navigateTo(url.href);
}

function isAuthenticationRedirect(url: URL): boolean {
  return (
    url.pathname.includes('/protocol/openid-connect/auth') ||
    url.pathname.includes('/broker/') ||
    url.searchParams.has('kc_idp_hint')
  );
}

function isIdentityLinkAction(url: URL): boolean {
  return url.searchParams.get('kc_action')?.startsWith('idp_link:') ?? false;
}

function onDocumentSubmit(event: SubmitEvent): void {
  if (event.defaultPrevented) {
    return;
  }

  const form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const action = new URL(form.getAttribute('action') || window.location.href, window.location.href);
  if (
    !isSameSpaHost(action) ||
    action.origin !== window.location.origin ||
    (isAuthenticationRedirect(action) && !action.searchParams.has('kc_action'))
  ) {
    return;
  }

  const realmPath = window.location.pathname.match(/^(\/realms\/[^/]+)/)?.[1];
  if (!realmPath || !action.pathname.startsWith(realmPath)) {
    return;
  }

  event.preventDefault();
  const method = (form.method || 'get').toUpperCase();
  const formData = event.submitter instanceof HTMLElement ? new FormData(form, event.submitter) : new FormData(form);

  if (method === 'GET') {
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        action.searchParams.append(key, value);
      }
    }
    void navigateRequest(action.href, { method: 'GET' });
    return;
  }

  void navigateRequest(action.href, {
    method,
    body: formData,
  });
}

function isSameSpaHost(url: URL): boolean {
  return url.host === window.location.host;
}
