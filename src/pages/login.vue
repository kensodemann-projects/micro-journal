<template>
  <div data-testid="login-page">
    <LoginCard
      class="mt-[25%] mx-[5%] sm:mt-[20%] sm:mx-[10%] md:mt-[10%] md:mx-[20%] lg:mx-[25%] xl:mx-[30%]"
      :loading="loading"
      @login="loginHandler"
      @resetPassword="resetPassword"
    />
    <v-alert
      v-if="message"
      type="error"
      class="mt-4 mx-[5%] sm:mx-[10%] md:mx-[20%] lg:mx-[25%] xl:mx-[30%]"
      @click="clearMessage"
    >
      {{ message }}
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
import LoginCard from '@/components/auth/LoginCard.vue';
import { useAuthentication } from '@/core/authentication';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { login } = useAuthentication();
const router = useRouter();
const loading = ref(false);
const message = ref('');

const loginHandler = async ({ email, password }: { email: string; password: string }) => {
  message.value = '';
  loading.value = true;
  try {
    await login({
      email,
      password,
    });
    await router.replace('/');
  } catch {
    message.value = 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
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
