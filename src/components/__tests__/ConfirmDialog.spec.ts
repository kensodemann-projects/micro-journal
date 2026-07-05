import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ConfirmDialog from '../ConfirmDialog.vue';

describe('Confirm Dialog', () => {
  const vuetify = createVuetify({ components, directives });
  const mountComponent = async (question: string) => {
    const wrapper = mount(ConfirmDialog, { global: { plugins: [vuetify] }, props: { question, modelValue: true } });
    await wrapper.vm.$nextTick();
    await flushPromises();
    return wrapper;
  };

  let wrapper: VueWrapper<InstanceType<typeof ConfirmDialog>>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('displays the question', async () => {
    const question = 'This is the question that I will ask?';
    wrapper = await mountComponent(question);
    expect(wrapper.find('[data-testid="body"]').text()).toBe(question);
  });

  it('emits cancel on no pressed', async () => {
    wrapper = await mountComponent('This is the question that I will ask?');
    const button = wrapper.find('[data-testid="no-button"]');
    await button.trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('emits confirm on yes pressed', async () => {
    wrapper = await mountComponent('This is the question that I will ask?');
    const button = wrapper.find('[data-testid="yes-button"]');
    await button.trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });
});
