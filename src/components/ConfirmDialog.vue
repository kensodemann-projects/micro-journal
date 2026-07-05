<template>
  <v-dialog v-model="showConfirmDialog" max-width="600px" data-testid="confirm-dialog">
    <v-card>
      <v-card-title data-testid="title">Are you sure?</v-card-title>
      <v-card-text data-testid="body">
        <div class="d-flex ga-4 align-center">
          <div><v-icon icon="mdi-help-rhombus" size="64" :color="iconColor || 'info'" /></div>
          <div>
            {{ message }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="$emit('confirm')" data-testid="yes-button">Yes</v-btn>
        <v-btn color="secondary" @click="$emit('cancel')" data-testid="no-button">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const showConfirmDialog = defineModel<boolean>({ required: true });
defineProps<{ message: string; iconColor?: string }>();
defineEmits(['confirm', 'cancel']);
</script>
