import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/delete-credential.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'delete-credential.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};
