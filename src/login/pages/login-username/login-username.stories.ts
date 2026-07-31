import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-username.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'login-username.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithInvalidUsername: Story = {
  globals: {
    kcContext: {
      message: {
        type: 'error',
        summary: 'Invalid username.',
      },
      messagesPerField: {
        existsError: (fieldName: string) => fieldName === 'username',
        getFirstError: (fieldName: string) => (fieldName === 'username' ? 'Invalid username.' : ''),
      },
    },
  },
};

export const WithSocialProviders: Story = {
  globals: {
    kcContext: {
      social: {
        displayInfo: true,
        providers: [
          {
            loginUrl: 'google',
            alias: 'google',
            providerId: 'google',
            displayName: 'Google',
            iconClasses: 'fa fa-google',
          },
          {
            loginUrl: 'github',
            alias: 'github',
            providerId: 'github',
            displayName: 'Github',
            iconClasses: 'fa fa-github',
          },
        ],
      },
    },
  },
};

export const WithoutRememberMe: Story = {
  globals: {
    kcContext: {
      realm: { rememberMe: false },
    },
  },
};
