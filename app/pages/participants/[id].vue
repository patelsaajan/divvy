<template>
  <div class="px-4 py-6">
    <div class="flex items-center mb-6">
      <button class="p-2 mr-2" @click="$router.back()">
        <UIcon name="i-heroicons-chevron-left" :size="24" />
      </button>
      <h1 class="text-xl font-semibold">Participants</h1>
    </div>
    
    <div class="bg-gray-800 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="bg-blue-100 p-1 rounded mr-2">
            <span class="text-blue-500 text-xs">Recipe #{{ id }}</span>
          </div>
          <h2>Week in NY</h2>
        </div>
      </div>
    </div>
    
    <!-- Participants List -->
    <div class="mb-6">
      <h3 class="font-medium mb-3">Participants ({{ participants.length }})</h3>
      <div 
        v-for="participant in participants" 
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
            <UIcon name="i-heroicons-user" :size="20" class="text-white" />
          </div>
          <div>
            <h3 class="font-medium">{{ participant.name }}</h3>
            <span class="text-xs text-gray-400">{{ participant.email }}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="font-semibold block">${{ participant.amount.toFixed(2) }}</span>
          <span class="text-xs text-gray-400">{{ participant.status }}</span>
        </div>
      </div>
    </div>
    
    <!-- Add Participant Button -->
    <button class="w-full bg-gray-800 rounded-lg p-4 flex items-center justify-center text-orange-500 mb-6">
      <UIcon name="i-heroicons-plus" :size="20" class="mr-2" />
      <span>Add Participant</span>
    </button>
    
    <!-- Summary -->
    <div class="bg-gray-800 rounded-lg p-4 mb-6">
      <h3 class="font-medium mb-3">Summary</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-400">Total Participants:</span>
          <span>{{ participants.length }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Total Amount:</span>
          <span class="font-semibold">${{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Average per Person:</span>
          <span>${{ (totalAmount / participants.length).toFixed(2) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="space-y-3">
      <button class="w-full bg-orange-500 text-white py-3 rounded-lg font-medium">
        Send Reminders
      </button>
      <NuxtLink 
        :to="`/recipe/${id}`" 
        class="w-full bg-gray-700 text-white py-3 rounded-lg font-medium block text-center"
      >
        Back to Recipe
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Get the route parameter
const route = useRoute()
const id = route.params.id

// Mock data for participants
const participants = [
  {
    id: 1,
    name: 'Stjepan Venerus',
    email: 'stjepan@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    amount: 124.13,
    status: 'Paid'
  },
  {
    id: 2,
    name: 'Axla',
    email: 'axla@example.com',
    avatar: '',
    amount: 124.13,
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    amount: 124.13,
    status: 'Paid'
  }
]

// Calculate total amount
const totalAmount = computed(() => {
  return participants.reduce((sum, participant) => sum + participant.amount, 0)
})
</script> 