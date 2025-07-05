<template>
  <UButton
    icon="i-heroicons-chevron-left"
    variant="ghost"
    color="secondary"
    :class="`cursor-pointer mt-6 ${_class}`"
    @click="navigateTo(link)"
  >
    {{ content }}
  </UButton>
</template>

<script setup lang="ts">
type PageProps = { link: string; content: string; class?: string };
const { link, content, class: _class } = defineProps<PageProps>(); // TODO: use cn and tw-merge to merge class
</script>
