import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-password.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'login-password.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithInvalidPassword: Story = {
  globals: {
    kcContext: {
      message: {
        type: 'error',
        summary: 'Invalid password.',
      },
      messagesPerField: {
        existsError: (fieldName: string) => fieldName === 'password',
        getFirstError: (fieldName: string) => (fieldName === 'password' ? 'Invalid password.' : ''),
      },
    },
  },
};

export const WithoutPasswordReset: Story = {
  globals: {
    kcContext: {
      realm: { resetPasswordAllowed: false },
    },
  },
};
