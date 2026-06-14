<template>
  <div data-testid="login-page">
    <LoginCard />
  </div>
</template>

<script lang="ts" setup>
import LoginCard from '@/components/auth/LoginCard.vue';
</script>

<style scoped>
@media (min-width: 0px) {
  .auth-card {
    margin-top: 25%;
    margin-left: 5%;
    margin-right: 5%;
  }

  .error-message {
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

  .error-message {
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

  .error-message {
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

  .error-message {
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

  .error-message {
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
