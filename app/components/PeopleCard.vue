<template>
  <div
    class="bg-gray-800 rounded-lg p-4 mb-2 flex justify-between items-center"
  >
    <div class="flex items-center">
      <div
        class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3"
      >
        <UIcon name="i-heroicons-user" :size="20" class="text-white" />
      </div>
      <h3 class="font-medium">{{ person?.name }}</h3>
    </div>
    <span class="font-semibold"> £{{ person?.amount.toFixed(2) }} </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  person: {
    type: Object,
    // required: true
  },
});
</script>
