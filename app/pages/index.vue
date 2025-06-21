<template>
  <div class="px-4 py-6 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <h1 class="font-semibold text-lg">2023 Expenses</h1>
        <ChevronDownIcon :size="20" class="ml-1" />
      </div>
      <div class="flex space-x-2">
        <button class="p-2">
          <BellIcon :size="20" />
        </button>
        <button class="p-2">
          <PlusIcon :size="20" />
        </button>
      </div>
    </div>
    
    <div class="flex space-x-4 overflow-x-auto py-2 mb-4">
      <button 
        v-for="(month, index) in months" 
        :key="month" 
        :class="[
          'px-4 py-1 whitespace-nowrap',
          activeMonth === index ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'
        ]"
        @click="activeMonth = index"
      >
        {{ month }}
      </button>
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
              <ExternalLinkIcon :size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronDownIcon, BellIcon, PlusIcon, ExternalLinkIcon } from 'lucide-vue-next'

const currentMonth = ref('September')
const months = ['September', 'August', 'July', 'June', 'May']
const activeMonth = ref(0)

const expenses = [
  {
    id: 1,
    name: 'Coffee and Bagel',
    amount: 12.5,
    date: 'Sep 15',
    category: 'food',
    emoji: '☕️',
    color: 'bg-amber-500'
  },
  {
    id: 2,
    name: 'Uber to Airport',
    amount: 45.8,
    date: 'Sep 15',
    category: 'transport',
    emoji: '🚗',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Pizzeria Dom Gino',
    amount: 95.37,
    date: 'Sep 15',
    category: 'food',
    emoji: '🍕',
    color: 'bg-teal-500'
  },
  {
    id: 4,
    name: 'Office Supplies',
    amount: 28.99,
    date: 'Sep 14',
    category: 'work',
    emoji: '📎',
    color: 'bg-purple-500'
  },
  {
    id: 5,
    name: 'Phone Bill',
    amount: 65.0,
    date: 'Sep 14',
    category: 'utilities',
    emoji: '📱',
    color: 'bg-cyan-500'
  }
]
</script> 