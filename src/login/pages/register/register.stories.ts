import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../../KcPageStory';

const meta: Meta<KcPageStory> = {
  title: 'login/register.ftl',
  component: KcPageStory,
  decorators: decorators,
  globals: {
    pageId: 'register.ftl',
  },
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithTerms: Story = {
  globals: {
    kcContext: {
      termsAcceptanceRequired: true,
    },
  },
};

export const WithRecaptcha: Story = {
  globals: {
    kcContext: {
      recaptchaRequired: true,
      recaptchaVisible: true,
      recaptchaSiteKey: 'test-site-key',
    },
  },
};
