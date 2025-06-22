<template>
  <div class="container mx-auto mt-6">
    <UButton variant="ghost" class="p-2 mr-2" @click="navigateTo('/')">
      <UIcon name="i-heroicons-chevron-left" :size="24" />
      <span class="ml-2">Receipts</span>
    </UButton>
    <h1 class="text-xl font-semibold">New Receipt</h1>
  </div>
</template>
