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
          Custom Conversion
        </h3>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-y-4">
        <p>
          Please enter the conversion rate for the currency you want to use.
        </p>
        <UForm :state="formState" class="flex flex-col gap-y-4">
          <UFormField label="Conversion Rate" required>
            <UInputNumber
              v-model="formState.conversionRate"
              :min="0"
              :step="0.01"
              :precision="2"
            />
          </UFormField>
          <UButton
            label="Save"
            color="primary"
            variant="solid"
            class="w-fit"
            @click="
              () => {
                emit('update:conversionRate', formState.conversionRate);
                emit('close');
              }
            "
          />
        </UForm>
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
const formState = reactive({
  conversionRate: 1,
});

const emit = defineEmits<{
  (e: "update:conversionRate", value: number): void;
  (e: "close"): void;
}>();

const props = defineProps<{
  open: boolean;
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => !value && emit("close"),
});
</script>

<style lang="scss" scoped></style>
