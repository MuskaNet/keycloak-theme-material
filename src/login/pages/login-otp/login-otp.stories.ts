import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-otp.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'login-otp.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithMultipleCredentials: Story = {
  globals: {
    kcContext: {
      otpLogin: {
        userOtpCredentials: [
          { id: 'cred1', userLabel: 'Authenticator App' },
          { id: 'cred2', userLabel: 'Security Key' },
        ],
        selectedCredentialId: 'cred1',
      },
    },
  },
};

export const WithOtpError: Story = {
  globals: {
    kcContext: {
      message: {
        type: 'error',
        summary: 'Invalid verification code.',
      },
      messagesPerField: {
        existsError: (fieldName: string) => fieldName === 'totp',
        get: (fieldName: string) => (fieldName === 'totp' ? 'Invalid verification code.' : ''),
      },
    },
  },
};
