<template>
  <div data-testid="login-page">
    <LoginCard class="auth-card" :loading="loading" @login="login" @resetPassword="resetPassword" />
  </div>
</template>

<script lang="ts" setup>
import LoginCard from '@/components/auth/LoginCard.vue';
import { ref } from 'vue';

const loading = ref(false);

const login = () => {
  loading.value = true;
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
</script>

<style scoped>
@media (min-width: 0px) {
  .auth-card {
    margin-top: 25%;
    margin-left: 5%;
    margin-right: 5%;
  }

  .feedback-message {
    margin-left: 5%;
    margin-right: 5%;
  }
}

@media (min-width: 576px) {
  .auth-card {
    margin-top: 20%;
    margin-left: 10%;
    margin-right: 10%;
  }

  .feedback-message {
    margin-left: 10%;
    margin-right: 10%;
  }
}

@media (min-width: 768px) {
  .auth-card {
    margin-top: 10%;
    margin-left: 20%;
    margin-right: 20%;
  }

  .feedback-message {
    margin-left: 20%;
    margin-right: 20%;
  }
}

@media (min-width: 992px) {
  .auth-card {
    margin-top: 10%;
    margin-left: 25%;
    margin-right: 25%;
  }

  .feedback-message {
    margin-left: 25%;
    margin-right: 25%;
  }
}

@media (min-width: 1200px) {
  .auth-card {
    margin-top: 10%;
    margin-left: 30%;
    margin-right: 30%;
  }

  .feedback-message {
    margin-left: 30%;
    margin-right: 30%;
  }
}
</style>

<route lang="yaml">
meta:
  layout: standalone
  allowAnonymous: true
</route>
