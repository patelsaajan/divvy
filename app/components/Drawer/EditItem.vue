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
          Edit Item
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
      <div class="flex flex-col justify-end gap-y-4 ">
        <UForm :state="item" class="flex flex-col justify-end gap-y-4 mb-4">
          <UFormField label="Title" required>
            <UInput v-model="item.title" />
          </UFormField>
          <UFormField label="Cost" required>
            <UInputNumber
              v-model="item.cost"
              :format-options="{
                style: 'currency',
                currency: 'GBP',
                currencyDisplay: 'symbol',
              }"
            />
          </UFormField>
        </UForm>
      </div>
      <UButton>
        <UIcon name="i-heroicons-pencil" />
        Save
      </UButton>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
type EditItem = { id: number; title: string; cost: number };

const props = defineProps<{
  open: boolean;
  item: EditItem;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<style lang="scss" scoped></style>
