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

  const mountComponent = async (
    message: string,
    options: { cancelLabel?: string; confirmLabel?: string; color?: string; title?: string } = {},
  ) => {
    const { cancelLabel, confirmLabel, color, title } = options;
    const wrapper = mount(ConfirmDialog, {
      global: { plugins: [vuetify] },
      props: { message, modelValue: true, cancelLabel, confirmLabel, title, color },
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

  describe('title', () => {
    it('defaults to a title of "Are you sure?"', async () => {
      wrapper = await mountComponent('This is the question that I will ask?');
      expect(findInDialog('title').text()).toBe('Are you sure?');
    });

    it('can be overridden with a custom title', async () => {
      wrapper = await mountComponent('This is the question that I will ask?', { title: 'Custom Title' });
      expect(findInDialog('title').text()).toBe('Custom Title');
    });
  });

  describe('icon', () => {
    it('uses the specified color', async () => {
      wrapper = await mountComponent('This is the question that I will ask?', { color: 'error' });
      const icon = wrapper.findComponent(components.VIcon);
      expect(icon.props('color')).toBe('error');
    });
  });

  describe('v-model', () => {
    it('is set to false when cancel is clicked', async () => {
      wrapper = await mountComponent('This is the question that I will ask?');
      await findInDialog('cancel-button').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('is set to false when confirm is clicked', async () => {
      wrapper = await mountComponent('This is the question that I will ask?');
      await findInDialog('confirm-button').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });
  });

  describe('cancel button', () => {
    it('defaults to a label of "Cancel"', async () => {
      wrapper = await mountComponent('This is the question that I will ask?');
      expect(findInDialog('cancel-button').text()).toBe('Cancel');
    });

    it('can be overridden with a custom label', async () => {
      wrapper = await mountComponent('This is the question that I will ask?', { cancelLabel: 'No' });
      expect(findInDialog('cancel-button').text()).toBe('No');
    });

    it('emits cancel on click', async () => {
      wrapper = await mountComponent('This is the question that I will ask?');
      await findInDialog('cancel-button').trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('always uses the secondary color', async () => {
      wrapper = await mountComponent('This is the question that I will ask?', { color: 'error' });
      const cancelButton = wrapper
        .findAllComponents(components.VBtn)
        .find((btn) => btn.attributes('data-testid') === 'cancel-button');
      expect(cancelButton?.props('color')).toBe('secondary');
    });
  });

  describe('confirm button', () => {
    it('defaults to a label of "Confirm"', async () => {
      wrapper = await mountComponent('This is the question that I will ask?');
      expect(findInDialog('confirm-button').text()).toBe('Confirm');
    });

    it('can be overridden with a custom label', async () => {
      wrapper = await mountComponent('This is the question that I will ask?', { confirmLabel: 'Yes' });
      expect(findInDialog('confirm-button').text()).toBe('Yes');
    });

    it('emits confirm on click', async () => {
      wrapper = await mountComponent('This is the question that I will ask?');
      await findInDialog('confirm-button').trigger('click');
      expect(wrapper.emitted('confirm')).toBeTruthy();
    });

    it('uses the specified color', async () => {
      wrapper = await mountComponent('This is the question that I will ask?', { color: 'error' });
      const confirmButton = wrapper
        .findAllComponents(components.VBtn)
        .find((btn) => btn.attributes('data-testid') === 'confirm-button');
      expect(confirmButton?.props('color')).toBe('error');
    });
  });
});
