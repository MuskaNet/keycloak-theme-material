/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from '@keycloakify/angular/account';
import type { ThemeName } from '../kc.gen';

/** @see: https://docs.keycloakify.dev/features/i18n */
const { getI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      noSessions: 'No active sessions',
      noApplications: 'No applications yet',
      noEvents: 'No recent activity',
      noIdentities: 'No linked accounts',
      noTotpConfigured: 'No authenticator configured',
      currentSession: 'Current session',
    },
    // cspell: disable
    'zh-CN': {
      noSessions: '暂无活动会话',
      noApplications: '暂无应用程序',
      noEvents: '暂无活动记录',
      noIdentities: '暂无关联账户',
      noTotpConfigured: '尚未配置身份验证器',
      currentSession: '当前会话',
    },
    fr: {
      noSessions: 'Aucune session active',
      noApplications: 'Aucune application',
      noEvents: 'Aucune activité récente',
      noIdentities: 'Aucun compte lié',
      noTotpConfigured: 'Aucun authentificateur configuré',
      currentSession: 'Session actuelle',
    },
    // cspell: enable
  })
  .build();

type I18n = typeof ofTypeI18n;

export { getI18n, type I18n };
