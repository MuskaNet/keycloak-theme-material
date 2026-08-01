import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'account/account.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'account.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithInvalidEmail: Story = {
  globals: {
    kcContext: {
      message: {
        type: 'error',
        summary: 'Invalid email address.',
      },
      messagesPerField: {
        existsError: (fieldName: string) => fieldName === 'email',
        get: (fieldName: string) => (fieldName === 'email' ? 'Invalid email address.' : ''),
      },
    },
  },
};
