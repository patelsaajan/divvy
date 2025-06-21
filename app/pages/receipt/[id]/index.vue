<template>
  <div class="container mx-auto mt-6">
    <div class="flex items-center mb-6">
      <UButton variant="ghost" class="p-2 mr-2" @click="$router.back()">
        <UIcon name="i-heroicons-chevron-left" :size="24" />
        <span class="ml-2">Expense Report</span>
      </UButton>
    </div>
    
    <div class="bg-gray-800 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h2>{{ expense.title }}</h2>
        </div>
      </div>
    </div>
    
    <!-- Receipt Items -->
    <div class="mb-6">
      <h3 class="font-medium mb-3">Receipt</h3>
      <div 
        v-for="receipt in expense.receipts" 
        :key="receipt.id" 
        class="bg-gray-800 rounded-lg p-4 mb-4"
      >
        <!-- Receipt Header -->
        <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
              <UIcon :name="receipt.icon" :size="20" class="text-white" />
            </div>
            <div>
              <h4 class="font-medium">{{ receipt.merchant }}</h4>
              <span class="text-xs text-gray-400">{{ receipt.date }}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="font-semibold text-lg">${{ receipt.total.toFixed(2) }}</span>
            <div class="text-xs text-gray-400">{{ receipt.items.length }} items</div>
          </div>
        </div>
        
        <!-- Receipt Line Items -->
        <div class="space-y-2">
          <div 
            v-for="item in receipt.items" 
            :key="item.id" 
            class="flex justify-between items-center py-2"
          >
            <div class="flex-1">
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-400">{{ item.category }}</div>
            </div>
            <div class="text-right">
              <div class="font-medium">${{ item.price.toFixed(2) }}</div>
              <div class="text-xs text-gray-400">Qty: {{ item.quantity }}</div>
            </div>
          </div>
        </div>
        
        <!-- Receipt Actions -->
        <div class="flex space-x-2 mt-3 pt-3 border-t border-gray-700">
          <NuxtLink to="/receipt/1/people" class="flex-1 bg-gray-700 text-white py-2 rounded text-sm flex items-center justify-center">
            <UIcon name="i-heroicons-user-group" :size="16" class="inline mr-1" />
            <span class="ml-2">People</span>
          </NuxtLink>
          <NuxtLink to="/receipt/1/edit" class="flex-1 bg-orange-500 text-white py-2 rounded text-sm flex items-center justify-center">
            <UIcon name="i-heroicons-pencil" :size="16" class="inline mr-1" />
            <span class="ml-2">Edit</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get the route parameter
const route = useRoute()
const id = route.params.id

// Mock data for the expense with receipt`z items
const expense = {
  title: 'Sicily Restaurant',
  receipts: [
    {
      id: 1,
      merchant: 'Pizzeria Dom Gino',
      date: 'Sep 12, 2023',
      total: 94.87,
      icon: 'i-heroicons-cake',
      items: [
        {
          id: 1,
          name: 'Margherita Pizza',
          category: 'Food & Dining',
          price: 18.99,
          quantity: 2
        },
        {
          id: 2,
          name: 'Pepperoni Pizza',
          category: 'Food & Dining',
          price: 19.99,
          quantity: 1
        },
        {
          id: 3,
          name: 'Garlic Bread',
          category: 'Food & Dining',
          price: 8.99,
          quantity: 2
        },
        {
          id: 4,
          name: 'Soft Drinks',
          category: 'Beverages',
          price: 3.99,
          quantity: 3
        },
        {
          id: 5,
          name: 'Delivery Fee',
          category: 'Service',
          price: 5.00,
          quantity: 1
        }
      ]
    }
  ]
}
</script> 