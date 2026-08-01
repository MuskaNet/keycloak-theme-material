import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/idp-review-user-profile.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'idp-review-user-profile.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};
