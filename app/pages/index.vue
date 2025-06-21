<template>
  <div class="px-4 py-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-semibold text-lg">Expenses</h1>        
      <NuxtLink to="/upload-receipt" class="p-2">
        <UIcon name="i-lucide-plus" :size="20" />
      </NuxtLink>
    </div>

    
    <div class="text-xs text-gray-400 mb-4">FRIDAY 15 SEP</div>
    
    <div class="space-y-3">
      <div 
        v-for="expense in expenses" 
        :key="expense.id" 
        class="bg-gray-800 rounded-lg p-4"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div :class="[expense.color, 'p-2 rounded-md mr-3']">
              <span class="text-white text-lg">{{ expense.emoji }}</span>
            </div>
            <div>
              <h3 class="font-medium">{{ expense.name }}</h3>
              <span class="text-xs text-gray-400">{{ expense.date }}</span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="font-semibold mr-2">
              ${{ expense.amount.toFixed(2) }}
            </span>
            <NuxtLink :to="`/expense/${expense.id}`" class="text-orange-500">
              <UIcon name="i-lucide-external-link" :size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExternalLinkIcon } from 'lucide-vue-next'

import { expenses } from '../../dummyData/dashboard';
</script> 