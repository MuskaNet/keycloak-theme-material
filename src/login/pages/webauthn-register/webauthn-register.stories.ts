import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/webauthn-register.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'webauthn-register.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithAppInitiatedAction: Story = {
  globals: {
    kcContext: {
      isAppInitiatedAction: true,
    },
  },
};

export const WithRetry: Story = {
  globals: {
    kcContext: {
      isSetRetry: true,
      isAppInitiatedAction: true,
      message: {
        type: 'error',
        summary: 'Registration failed. Please try again.',
      },
    },
  },
};
