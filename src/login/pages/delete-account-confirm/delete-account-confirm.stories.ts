import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/delete-account-confirm.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'delete-account-confirm.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};
