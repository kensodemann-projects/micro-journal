<template>
  <v-card class="auth-card pa-5">
    <v-card-title class="text-h5">{{
      resetMode ? 'Get Password Reset Instructions' : 'Login to Your Account'
    }}</v-card-title>
    <v-card-text>
      <div class="mb-8" v-if="resetMode">
        Please enter your email address. If your email is associated with a valid active account, we will send an
        instructional email with a password reset link. Use that link to reset your password.
      </div>
      <v-form ref="loginForm" v-model="valid">
        <v-text-field
          v-model="email"
          label="Email"
          :rules="[validationRules.required, validationRules.email]"
          required
          ref="emailInput"
        ></v-text-field>
        <v-text-field
          v-if="!resetMode"
          class="mt-4"
          v-model="password"
          label="Password"
          :rules="[validationRules.required]"
          type="password"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="login" :disabled="!valid" :loading="loading">{{
        resetMode ? 'Send Reset Instructions' : 'Login'
      }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="secondary" @click="forgotPassword" :disabled="loading">{{
        resetMode ? 'Cancel' : 'Forgot Password?'
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { onMounted, ref } from 'vue';
import type { VTextField } from 'vuetify/components';

const email = ref('');
const password = ref('');
const valid = ref(false);
const resetMode = ref(false);
const emailInput = ref<InstanceType<typeof VTextField> | null>(null);

defineProps({ loading: Boolean });
const emit = defineEmits(['login', 'resetPassword']);

const login = async () => {
  if (resetMode.value) {
    emit('resetPassword', {
      email: email.value,
    });
  } else {
    emit('login', {
      email: email.value,
      password: password.value,
    });
    resetMode.value = false;
  }
};

const forgotPassword = () => {
  resetMode.value = !resetMode.value;
};

onMounted(() => emailInput.value?.focus());
</script>
