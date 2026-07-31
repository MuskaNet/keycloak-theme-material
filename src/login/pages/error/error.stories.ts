import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/error.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'error.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithBackToApplication: Story = {
  globals: {
    kcContext: {
      message: {
        summary: 'The authentication process has failed.',
        type: 'error',
      },
      client: { baseUrl: 'https://example.com' },
    },
  },
};

export const WithErrorMessage: Story = {
  globals: {
    kcContext: {
      message: {
        summary: 'Invalid username or password.',
        type: 'error',
      },
    },
  },
};
