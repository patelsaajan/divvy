<template>
  <!-- Members Drawer -->
  <UDrawer
    v-model:open="isOpen"
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
            <p class="font-medium text-gray-900 dark:text-white">
              {{ person.name }}
            </p>
          </div>
          <UButton
            variant="ghost"
            color="error"
            icon="i-heroicons-trash"
            :loading="removingMemberId === person.id"
            @click="handleRemoveMember(person.id)"
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
            :disabled="isAddingMember"
          />
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="handleAddPerson"
            :disabled="!newPerson.trim() || isAddingMember"
            :loading="isAddingMember"
          >
            Add
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { useMembers } from "~/composables/useMembers";

const newPerson = ref("");
const isAddingMember = ref(false);
const removingMemberId = ref<string | number | null>(null);
const { members, addMember, removeMember } = useMembers();

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// Create a computed property for two-way binding
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) {
      emit("close");
    }
  },
});

const handleAddPerson = async () => {
  if (!newPerson.value.trim() || isAddingMember.value) return;

  isAddingMember.value = true;

  try {
    await addMember(newPerson.value.trim());
    newPerson.value = "";
  } finally {
    isAddingMember.value = false;
  }
};

const handleRemoveMember = async (id: string) => {
  if (removingMemberId.value === id) return;

  removingMemberId.value = id;

  try {
    const success = await removeMember(id);
    // If the operation failed, the member will still be in the list
    // and the error will be shown via the toast in the composable
  } finally {
    removingMemberId.value = null;
  }
};
</script>

<style lang="scss" scoped></style>
