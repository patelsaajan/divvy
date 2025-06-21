<template>
  <div class="px-4 py-6">
    <div class="flex items-center mb-6">
      <button class="p-2 mr-2" @click="$router.back()">
        <ChevronLeftIcon :size="24" />
      </button>
      <h1 class="text-xl font-semibold">Report</h1>
    </div>
    
    <div class="bg-gray-800 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="bg-orange-100 p-1 rounded mr-2">
            <span class="text-orange-500 text-xs">{{ expense.status }}</span>
          </div>
          <h2>{{ expense.title }}</h2>
        </div>
      </div>
    </div>
    
    <!-- Participants -->
    <div class="mb-6">
      <div 
        v-for="participant in expense.participants" 
        :key="participant.id" 
        class="bg-gray-800 rounded-lg p-4 mb-2 flex justify-between items-center"
      >
        <div class="flex items-center">
          <img 
            v-if="participant.avatar" 
            :src="participant.avatar" 
            :alt="participant.name" 
            class="w-10 h-10 rounded-full mr-3" 
          />
          <div 
            v-else 
            class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3"
          >
            <UserIcon :size="20" class="text-white" />
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
    
    <!-- Expense items -->
    <div class="mb-6">
      <div 
        v-for="item in expense.items" 
        :key="item.id" 
        class="bg-gray-800 rounded-lg p-4 mb-2 flex justify-between items-center"
      >
        <div class="flex items-center">
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center mr-3',
              item.name.includes('Pizzeria') ? 'bg-teal-500' : 'bg-purple-500'
            ]"
          >
            <span class="text-white text-lg">
              {{ item.name.includes('Pizzeria') ? '🍕' : '🛒' }}
            </span>
          </div>
          <div>
            <h3 class="font-medium">{{ item.name }}</h3>
            <span class="text-xs text-gray-400">{{ item.date }}</span>
          </div>
        </div>
        <span class="font-semibold">${{ item.amount.toFixed(2) }}</span>
      </div>
      
      <button class="w-full bg-gray-800 rounded-lg p-4 flex items-center justify-center text-orange-500">
        <PlusIcon :size="20" class="mr-2" />
        <span>Add New Expense</span>
      </button>
    </div>
    
    <!-- Summary -->
    <div class="bg-gray-800 rounded-lg p-4 mb-6">
      <p class="text-sm text-gray-400 mb-2">
        This was rejected because the value that was established was $400, and
        ended at $123.39. Can you check the receipts to be sure?
      </p>
    </div>
    
    <button class="w-full bg-orange-500 text-white py-3 rounded-lg font-medium">
      Submit
    </button>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, UserIcon, PlusIcon } from 'lucide-vue-next'

// Get the route parameter
const route = useRoute()
const id = route.params.id

// Mock data for the expense
const expense = {
  title: 'Week in NY',
  status: 'Pending',
  total: 400.0,
  participants: [
    {
      id: 1,
      name: 'Stjepan Venerus',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      amount: 124.13
    },
    {
      id: 2,
      name: 'Axla',
      avatar: '',
      amount: 124.13
    }
  ],
  items: [
    {
      id: 1,
      name: 'Pizzeria Dom Gino',
      date: 'Sep 12',
      amount: 94.87
    },
    {
      id: 2,
      name: 'Walmart',
      date: 'Sep 15',
      amount: 48.52
    }
  ]
}
</script> 