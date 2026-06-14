<template>
  <div data-testid="login-page">
    <LoginCard
      class="mt-[25%] mx-[5%] sm:mt-[20%] sm:mx-[10%] md:mt-[10%] md:mx-[20%] lg:mx-[25%] xl:mx-[30%]"
      :loading="loading"
      @login="login"
      @resetPassword="resetPassword"
    />
    <v-alert
      v-if="message"
      :type="messageType"
      class="mt-4 mx-[5%] sm:mx-[10%] md:mx-[20%] lg:mx-[25%] xl:mx-[30%]"
      @click="clearMessage"
    >
      {{ message }}
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
import LoginCard from '@/components/auth/LoginCard.vue';
import { ref } from 'vue';

const loading = ref(false);
const message = ref('');
const messageType = ref<'error' | 'success'>('error');

const login = () => {
  loading.value = true;
  message.value = 'Login failed. Please try again.';
  messageType.value = 'error';
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const resetPassword = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const clearMessage = () => {
  message.value = '';
};
</script>

<route lang="yaml">
meta:
  layout: standalone
  allowAnonymous: true
</route>
