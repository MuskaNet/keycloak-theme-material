import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-update-password.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'login-update-password.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithPasswordErrors: Story = {
  globals: {
    kcContext: {
      message: {
        type: 'error',
        summary: 'Passwords do not match.',
      },
      messagesPerField: {
        existsError: (fieldName: string, ...otherFieldNames: string[]) =>
          [fieldName, ...otherFieldNames].includes('password-confirm'),
        get: (fieldName: string) => (fieldName === 'password-confirm' ? 'Passwords do not match.' : ''),
      },
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
