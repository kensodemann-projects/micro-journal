import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import LoginPage from '../login.vue';

vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(LoginPage, { global: { plugins: [vuetify] } });

describe('LoginPage', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      replace: vi.fn(),
    });
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.find('[data-testid="login-page"]').exists()).toBe(true);
  });

  describe('Login', () => {
    it('shows error message on login failure', async () => {
      // const { login } = useAuthentication();
      wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'LoginCard' });

      // (login as Mock).mockRejectedValue(new Error('Invalid credentials'));

      await loginCard.vm.$emit('login', {
        email: 'test@example.com',
        password: 'wrong-password',
      });
      await flushPromises();

      const alert = wrapper.findComponent(components.VAlert);
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toBe('Login failed. Please try again.');
    });
  });
});
