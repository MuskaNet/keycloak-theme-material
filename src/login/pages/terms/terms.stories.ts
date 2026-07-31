import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/terms.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'terms.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithCustomTerms: Story = {};

export const AcceptAndDecline: Story = {};
