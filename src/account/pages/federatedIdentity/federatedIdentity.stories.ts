import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'account/federatedIdentity.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'federatedIdentity.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithMultipleIdentities: Story = {
  globals: {
    kcContext: {
      federatedIdentity: {
        identities: [
          {
            providerId: 'google',
            displayName: 'Google',
            userName: 'john.doe@gmail.com',
            connected: true,
          },
          {
            providerId: 'github',
            displayName: 'GitHub',
            userName: 'john-doe',
            connected: true,
          },
          {
            providerId: 'facebook',
            displayName: 'Facebook',
            userName: '',
            connected: false,
          },
        ],
        removeLinkPossible: true,
      },
    },
  },
};

export const RemoveLinkNotPossible: Story = {
  globals: {
    kcContext: {
      federatedIdentity: {
        removeLinkPossible: false,
      },
    },
  },
};
