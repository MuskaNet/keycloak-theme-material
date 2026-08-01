import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'account/sessions.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'sessions.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithMultipleSessions: Story = {
  globals: {
    kcContext: {
      sessions: {
        sessions: [
          {
            id: '1',
            ipAddress: '127.0.0.1',
            started: '2024-01-01 10:00:00',
            lastAccess: '2024-01-01 12:00:00',
            expires: '2024-01-02 10:00:00',
            clients: ['account'],
            current: true,
          },
          {
            id: '2',
            ipAddress: '192.168.1.10',
            started: '2024-01-01 09:00:00',
            lastAccess: '2024-01-01 11:00:00',
            expires: '2024-01-02 09:00:00',
            clients: ['account', 'my-app'],
            current: false,
          },
        ],
      },
    },
  },
};
