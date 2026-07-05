<template>
  <v-dialog v-model="showConfirmDialog" max-width="600px" persistent data-testid="confirm-dialog">
    <v-card>
      <v-card-title data-testid="title">{{ title || 'Are you sure?' }}</v-card-title>
      <v-card-text data-testid="body">
        <div class="flex items-center gap-4">
          <v-icon icon="mdi-help-rhombus" size="64" :color="color || 'primary'" />
          <div>
            {{ message }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn :color="color || 'primary'" @click="$emit('confirm')" data-testid="confirm-button">{{
          confirmLabel || 'Confirm'
        }}</v-btn>
        <v-btn color="secondary" @click="$emit('cancel')" data-testid="cancel-button">{{
          cancelLabel || 'Cancel'
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const showConfirmDialog = defineModel<boolean>({ required: true });
defineProps<{ message: string; color?: string; title?: string; cancelLabel?: string; confirmLabel?: string }>();
defineEmits(['confirm', 'cancel']);
</script>
