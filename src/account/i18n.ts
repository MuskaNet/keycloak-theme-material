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
      unlinkIdentity: 'Unlink',
      linkIdentity: 'Link',
      passwordChangeRedirectMessage: 'You will be redirected to the secure account area to update your password.',
      passwordChangeButton: 'Change password',
      totpSetupRedirectMessage: 'You will be redirected to the secure account area to set up your authenticator.',
      totpSetupButton: 'Set up authenticator',
      totpDeleteRedirectMessage:
        'You will be redirected to the secure account area to confirm the removal of your authenticator.',
      editProfile: 'Edit profile',
    },
    // cspell: disable
    'zh-CN': {
      noSessions: '暂无活动会话',
      noApplications: '暂无应用程序',
      noEvents: '暂无活动记录',
      noIdentities: '暂无关联账户',
      noTotpConfigured: '尚未配置身份验证器',
      currentSession: '当前会话',
      unlinkIdentity: '解除绑定',
      linkIdentity: '绑定',
      passwordChangeRedirectMessage: '即将跳转到安全区域完成密码修改。',
      passwordChangeButton: '修改密码',
      totpSetupRedirectMessage: '即将跳转到安全区域完成验证器设置。',
      totpSetupButton: '设置验证器',
      totpDeleteRedirectMessage: '即将跳转到安全区域确认删除验证器。',
      editProfile: '编辑资料',
    },
    fr: {
      noSessions: 'Aucune session active',
      noApplications: 'Aucune application',
      noEvents: 'Aucune activité récente',
      noIdentities: 'Aucun compte lié',
      noTotpConfigured: 'Aucun authentificateur configuré',
      currentSession: 'Session actuelle',
      unlinkIdentity: 'Dissocier',
      linkIdentity: 'Associer',
      passwordChangeRedirectMessage:
        'Vous serez redirigé vers la zone sécurisée pour mettre à jour votre mot de passe.',
      passwordChangeButton: 'Modifier le mot de passe',
      totpSetupRedirectMessage: 'Vous serez redirigé vers la zone sécurisée pour configurer votre authentificateur.',
      totpSetupButton: "Configurer l'authentificateur",
      totpDeleteRedirectMessage:
        "Vous serez redirigé vers la zone sécurisée pour confirmer la suppression de l'authentificateur.",
      editProfile: 'Modifier le profil',
    },
    // cspell: enable
  })
  .build();

type I18n = typeof ofTypeI18n;

export { getI18n, type I18n };
