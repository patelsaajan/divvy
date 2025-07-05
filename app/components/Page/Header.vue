<template>
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">{{ props.title }}</h1>
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
type PageProps = { title: string };
const props = defineProps<PageProps>();
</script>
