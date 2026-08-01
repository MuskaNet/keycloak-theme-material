import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'account/password.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'password.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithExistingPassword: Story = {
  globals: {
    kcContext: {
      password: {
        passwordSet: true,
      },
    },
  },
};
