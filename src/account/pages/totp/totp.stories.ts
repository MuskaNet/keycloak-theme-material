import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'account/totp.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'totp.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const ManualMode: Story = {
  globals: {
    kcContext: {
      mode: 'manual',
    },
  },
};

export const SetupNotEnabled: Story = {
  globals: {
    kcContext: {
      totp: {
        enabled: false,
        otpCredentials: [],
      },
    },
  },
};

export const WithCredentials: Story = {
  globals: {
    kcContext: {
      totp: {
        enabled: true,
        otpCredentials: [
          {
            id: '1',
            userLabel: 'My phone',
          },
          {
            id: '2',
            userLabel: 'My tablet',
          },
        ],
      },
    },
  },
};
