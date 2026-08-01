import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/login-recovery-authn-code-config.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'login-recovery-authn-code-config.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};
