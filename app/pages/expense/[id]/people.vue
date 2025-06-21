<template>
    <div class="container mx-auto">
        <UButton variant="ghost" class="flex items-center my-6 cursor-pointer" @click="$router.back()">
            <UIcon name="i-heroicons-chevron-left" :size="24" />
            <span class="ml-2">Receipts</span>
        </UButton>
        <h1 class="text-xl font-semibold">People</h1>
     <!-- Participants -->
     <div class="mb-6">
      <div 
        v-for="participant in expense.participants" 
        :key="participant.id" 
        class="bg-gray-800 rounded-lg p-4 mb-2 flex justify-between items-center"
      >
        <div class="flex items-center">
          <div 
            class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3"
          >
            <UIcon name="i-heroicons-user" :size="20" class="text-white" />
          </div>
          <div>
            <h3 class="font-medium">{{ participant.name }}</h3>
            <span class="text-xs text-gray-400">Sep 21</span>
          </div>
        </div>
        <span class="font-semibold">
          ${{ participant.amount.toFixed(2) }}
            </span>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const expense = ref({
  participants: [
    { id: 1, name: 'John Doe', amount: 100 },
    { id: 2, name: 'Jane Smith', amount: 200 },
  ],
});
</script>