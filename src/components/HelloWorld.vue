<template>
  <v-container class="h-full flex items-center" max-width="900">
    <div>
      <v-img alt="Placeholder logo" class="mb-4" height="150" src="@/assets/logo.png" />

      <div class="mb-8 text-center">
        <div class="font-light -mb-1">Welcome to</div>
        <h1 class="text-6xl font-heading font-bold">Micro Journal</h1>
      </div>
      <v-btn @click="showInfoDialog = true">Info Dialog</v-btn>
      <v-btn @click="showWarningDialog = true">Warning Dialog</v-btn>
      <v-btn @click="showDangerDialog = true">Danger Dialog</v-btn>
    </div>
  </v-container>

  <ConfirmDialog v-model="showInfoDialog" message="This is a typical confirmation dialog." />
  <ConfirmDialog v-model="showWarningDialog" message="This is a warning dialog." iconColor="warning" />
  <ConfirmDialog v-model="showDangerDialog" message="This is a danger dialog." iconColor="error" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';

const showInfoDialog = ref(false);
const showWarningDialog = ref(false);
const showDangerDialog = ref(false);
</script>

<style scoped>
@reference "../styles/tailwind.css";

/*
  1. mixing helper classes and @apply for demonstration purposes only
  2. the classes below are NOT wrapped in any CSS layer, so they "win" over everything else
*/
.hero-card {
  @apply py-3 md:pr-[120px] w-full transition-none;
}

:deep(.v-card) {
  @apply bg-gray-200;
  @apply dark:bg-black dark:bg-linear-to-r dark:from-primary/50 dark:to-primary/30 dark:text-white/80;
}
</style>
