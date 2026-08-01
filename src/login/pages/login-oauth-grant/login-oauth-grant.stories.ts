import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-oauth-grant.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'login-oauth-grant.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};
