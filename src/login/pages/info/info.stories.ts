import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/info.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'info.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithEmailSent: Story = {
  globals: {
    kcContext: {
      message: {
        summary: 'An email with instructions to reset your password has been sent to your inbox.',
        type: 'info',
      },
      messageHeader: 'Email sent',
      pageRedirectUri: 'https://example.com',
    },
  },
};

export const WithRequiredActions: Story = {
  globals: {
    kcContext: {
      message: {
        summary: 'Additional actions are required to complete your login.',
        type: 'info',
      },
      requiredActions: ['UPDATE_PASSWORD', 'VERIFY_EMAIL'],
    },
  },
};

export const WithoutRedirect: Story = {
  globals: {
    kcContext: {
      message: {
        summary: 'Your account has been created.',
        type: 'success',
      },
      skipLink: true,
    },
  },
};
