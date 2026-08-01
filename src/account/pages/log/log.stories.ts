import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'account/log.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'log.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithMultipleEvents: Story = {
  globals: {
    kcContext: {
      log: {
        events: [
          {
            date: '2/21/2024, 1:28:39 PM',
            event: 'login',
            ipAddress: '172.17.0.1',
            client: 'security-admin-console',
            details: [{ key: 'openid-connect', value: 'admin' }],
          },
          {
            date: '2/21/2024, 1:30:12 PM',
            event: 'update_profile',
            ipAddress: '172.17.0.1',
            client: 'account',
            details: [
              { key: 'first_name', value: 'John' },
              { key: 'last_name', value: 'Doe' },
            ],
          },
          {
            date: '2/21/2024, 2:00:00 PM',
            event: 'logout',
            ipAddress: '192.168.1.10',
            client: 'account',
            details: [],
          },
        ],
      },
    },
  },
};
