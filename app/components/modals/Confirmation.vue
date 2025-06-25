<template>
  <UModal :close="{ onClick: () => emit('close', false) }" :title="title">
    <template #body>
      <div class="flex flex-col gap-6">
        <span>{{ text }}</span>
        <UButton
          color="error"
          class="text-white cursor-pointer mx-auto text-center"
          size="xl"
          icon="i-heroicons-trash"
          :label="confirmText"
          @click="emit('confirm', true)"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}>();

const emit = defineEmits<{ close: [boolean]; confirm: [boolean] }>();
</script>
