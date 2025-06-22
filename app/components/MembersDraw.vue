<template>
  <!-- Members Drawer -->
  <UDrawer
    v-model:open="props.open"
    should-scale-background
    inset
    set-background-color-on-scale
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
        >
          Members
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="emit('close')"
        />
      </div>
    </template>

    <template #body>
      <!-- Members -->
      <div class="space-y-4 min-h-[75vh]">
        <div
          v-for="person in members"
          :key="person.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <UAvatar :alt="person.name" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ person.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                ${{ person.amount.toFixed(2) }}
              </p>
            </div>
          </div>
          <UButton
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            @click="emit('removeMember', person.id)"
          />
        </div>

        <!-- Add new member form -->
        <div
          class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <UInput
            v-model="newPerson"
            placeholder="Enter a name"
            class="flex-1"
            @keyup.enter="addPerson"
          />
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="addPerson"
            :disabled="!newPerson.trim()"
          >
            Add
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import type { ReceiptMember } from '~~/types/receipts';

const newPerson = ref("");

const props = defineProps<{
    open: boolean;
    members: ReceiptMember[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'removeMember', id: number): void;
}>();

const addPerson = () => {
  if (!newPerson.value.trim()) return;

  const newMember: ReceiptMember = {
    id: Date.now(),
    name: newPerson.value.trim(),
    amount: 0,
    checked: false,
  };

  props.members.push(newMember);
  newPerson.value = "";
};
</script>

<style lang="scss" scoped></style>
