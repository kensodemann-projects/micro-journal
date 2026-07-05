import { DOMWrapper, flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ConfirmDialog from '../ConfirmDialog.vue';

describe('Confirm Dialog', () => {
  const vuetify = createVuetify({ components, directives });

  const findInDialog = (testId: string) => {
    const element = document.body.querySelector(`[data-testid="${testId}"]`);
    expect(element).not.toBeNull();
    return new DOMWrapper(element as Element);
  };

  const mountComponent = async (message: string) => {
    const wrapper = mount(ConfirmDialog, {
      global: { plugins: [vuetify] },
      props: { message, modelValue: true },
      attachTo: document.body,
    });
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

  it('displays the message', async () => {
    const message = 'This is the question that I will ask?';
    wrapper = await mountComponent(message);
    expect(findInDialog('body').text()).toBe(message);
  });

  it('emits cancel on no pressed', async () => {
    wrapper = await mountComponent('This is the question that I will ask?');
    await findInDialog('no-button').trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('emits confirm on yes pressed', async () => {
    wrapper = await mountComponent('This is the question that I will ask?');
    await findInDialog('yes-button').trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });
});
