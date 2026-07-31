import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-config-totp.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'login-config-totp.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const ManualMode: Story = {
  globals: {
    kcContext: {
      mode: 'manual',
    },
  },
};

export const WithAppInitiatedAction: Story = {
  globals: {
    kcContext: {
      isAppInitiatedAction: true,
    },
  },
};

export const WithTotpError: Story = {
  globals: {
    kcContext: {
      message: {
        type: 'error',
        summary: 'Invalid authenticator code.',
      },
      messagesPerField: {
        existsError: (fieldName: string, ...otherFieldNames: string[]) =>
          [fieldName, ...otherFieldNames].includes('totp'),
        get: (fieldName: string) => (fieldName === 'totp' ? 'Invalid authenticator code.' : ''),
      },
    },
  },
};
