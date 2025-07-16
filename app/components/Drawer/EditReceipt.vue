<template>
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
          Create New Receipt
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
      <div class="flex flex-col gap-y-4 min-h-[75vh]">
        <UForm :state="form" class="flex flex-col gap-y-4">
          <UFormField label="Title" required>
            <UInput />
          </UFormField>

          <UFormField label="Cost" required>
            <UInputNumber
              :min="0"
              :step="0.01"
              :precision="2"
              :format-options="{
                style: 'currency',
                currency: 'GBP',
                currencyDisplay: 'symbol',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }"
            />
          </UFormField>

          <UFormField label="Vendor">
            <UInput />
          </UFormField>
        </UForm>
      </div>

      <UButton
        icon="i-heroicons-pencil"
        @click="handleSave"
        :loading="isSaving"
        class="mt-4 w-full flex items-center justify-center gap-2 rounded-full"
      >
        Save
      </UButton>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";

const form = useForm();

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const isSaving = ref(false);

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => !value && emit("close"),
});

const handleSave = () => {};
</script>
