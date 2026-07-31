import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-reset-password.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'login-reset-password.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithUsernameError: Story = {
  globals: {
    kcContext: {
      messagesPerField: {
        existsError: (fieldName: string) => fieldName === 'username',
        get: (fieldName: string) => (fieldName === 'username' ? 'Invalid username.' : ''),
      },
    },
  },
};

export const WithDuplicateEmails: Story = {
  globals: {
    kcContext: {
      realm: { duplicateEmailsAllowed: true },
    },
  },
};
