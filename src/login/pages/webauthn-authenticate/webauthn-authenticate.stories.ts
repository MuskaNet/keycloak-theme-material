import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/webauthn-authenticate.ftl',
  component: KcPageStory,
  decorators,
  globals: {
    pageId: 'webauthn-authenticate.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};
