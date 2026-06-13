import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import LoginCard from '../LoginCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const createWrapper = (props = {}) => {
  return mount(
    {
      template: '<v-layout><LoginCard v-bind="$attrs" @login="() => null"></LoginCard></v-layout>',
    },
    {
      props,
      global: {
        components: {
          LoginCard,
        },
        plugins: [vuetify],
      },
    },
  );
};

const getButtons = (wrapper: ReturnType<typeof createWrapper>) => {
  const buttons = wrapper.findAll('button');
  const loginButton = buttons.find((btn) => btn.text() === 'Login')!;
  const forgotPasswordButton = buttons.find((btn) => btn.text() === 'Forgot Password?')!;
  const sendResetButton = buttons.find((btn) => btn.text() === 'Send Reset Instructions')!;
  const cancelButton = buttons.find((btn) => btn.text() === 'Cancel')!;
  return { loginButton, forgotPasswordButton, sendResetButton, cancelButton };
};

const getInputs = (wrapper: ReturnType<typeof createWrapper>) => {
  const emailInput = wrapper.find('input[type="text"]')!;
  const passwordInput = wrapper.find('input[type="password"]')!;
  return { emailInput, passwordInput };
};

describe('LoginCard', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders the login form with correct title', () => {
    wrapper = createWrapper();
    const title = wrapper.findComponent(components.VCardTitle);
    expect(title.text()).toBe('Login to Your Account');
  });

  it('renders email and password fields', () => {
    wrapper = createWrapper();
    const inputs = wrapper.findAllComponents(components.VTextField);
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.props('label')).toBe('Email');
    expect(inputs[1]?.props('label')).toBe('Password');
  });

  it('renders login and forgot password buttons', () => {
    wrapper = createWrapper();
    const buttons = wrapper.findAllComponents(components.VBtn);
    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.text()).toBe('Login');
    expect(buttons[1]?.text()).toBe('Forgot Password?');
  });

  it('disables login button when form is invalid', async () => {
    wrapper = createWrapper();
    const { loginButton } = getButtons(wrapper);
    expect(loginButton.attributes('disabled')).toBeDefined();
  });

  it('enables login button when form is valid', async () => {
    wrapper = createWrapper();
    const { loginButton } = getButtons(wrapper);
    const { emailInput, passwordInput } = getInputs(wrapper);

    expect(loginButton.attributes('disabled')).toBeDefined();

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    await flushPromises();

    expect(loginButton.exists()).toBe(true);
    expect(loginButton.attributes('disabled')).toBeUndefined();
  });

  it('validates email format', async () => {
    wrapper = createWrapper();
    const { emailInput } = getInputs(wrapper);
    await emailInput.setValue('invalid-email');
    await emailInput.trigger('blur');
    expect(wrapper.text()).toContain('Invalid e-mail');
  });

  it('validates email is required', async () => {
    wrapper = createWrapper();
    const { emailInput } = getInputs(wrapper);

    await emailInput.trigger('focus');
    await emailInput.trigger('blur');
    expect(wrapper.text()).toContain('Required');

    await emailInput.setValue('test@test.com');
    await emailInput.trigger('blur');
    expect(wrapper.text()).not.toContain('Required');
  });

  it('validates password is required', async () => {
    wrapper = createWrapper();
    const { passwordInput } = getInputs(wrapper);

    await passwordInput.trigger('focus');
    await passwordInput.trigger('blur');
    expect(wrapper.text()).toContain('Required');

    await passwordInput.setValue('foorbar');
    await passwordInput.trigger('blur');
    expect(wrapper.text()).not.toContain('Required');
  });

  it('emits login event when login is clicked', async () => {
    wrapper = createWrapper();
    const loginCard = wrapper.findComponent(LoginCard);
    const { emailInput, passwordInput } = getInputs(wrapper);
    const { loginButton } = getButtons(wrapper);

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');
    await flushPromises();
    await loginButton.trigger('click');

    expect(loginCard.emitted('login')).toBeTruthy();
    expect(loginCard.emitted('login')).toHaveLength(1);

    const loginEvent = loginCard.emitted('login')?.[0];
    expect(loginEvent).toBeDefined();
    expect(loginEvent?.[0]).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  describe('clicking the forgot password button', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      const { forgotPasswordButton } = getButtons(wrapper);
      await forgotPasswordButton.trigger('click');
    });

    it('changes the title of the card', async () => {
      const title = wrapper.findComponent(components.VCardTitle);
      expect(title.text()).toBe('Get Password Reset Instructions');
    });

    it('renders just the email field', () => {
      const inputs = wrapper.findAllComponents(components.VTextField);
      expect(inputs).toHaveLength(1);
      expect(inputs[0]?.props('label')).toBe('Email');
    });

    it('renders send reset instructions and cancel buttons', () => {
      const buttons = wrapper.findAllComponents(components.VBtn);
      expect(buttons).toHaveLength(2);
      expect(buttons[0]?.text()).toBe('Send Reset Instructions');
      expect(buttons[1]?.text()).toBe('Cancel');
    });

    it('emits resetPassword event when send reset instructions is clicked', async () => {
      const loginCard = wrapper.findComponent(LoginCard);
      const { emailInput } = getInputs(wrapper);
      const { sendResetButton } = getButtons(wrapper);

      await emailInput.setValue('test@example.com');
      await flushPromises();
      await sendResetButton.trigger('click');

      expect(loginCard.emitted('resetPassword')).toBeTruthy();
      expect(loginCard.emitted('resetPassword')).toHaveLength(1);

      const loginEvent = loginCard.emitted('resetPassword')?.[0];
      expect(loginEvent).toBeDefined();
      expect(loginEvent?.[0]).toEqual({
        email: 'test@example.com',
      });
    });

    it('resets to login on cancel', async () => {
      const { cancelButton } = getButtons(wrapper);
      await cancelButton.trigger('click');
      const title = wrapper.findComponent(components.VCardTitle);
      expect(title.text()).toBe('Login to Your Account');
      const inputs = wrapper.findAllComponents(components.VTextField);
      expect(inputs).toHaveLength(2);
      const buttons = wrapper.findAllComponents(components.VBtn);
      expect(buttons).toHaveLength(2);
      expect(buttons[0]?.text()).toBe('Login');
      expect(buttons[1]?.text()).toBe('Forgot Password?');
    });
  });

  it('applies correct CSS classes', () => {
    wrapper = createWrapper();
    const card = wrapper.find('.auth-card');
    expect(card.exists()).toBe(true);
    expect(card.classes()).toContain('pa-5');
  });
});
