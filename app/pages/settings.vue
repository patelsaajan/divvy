<template>
  <div class="px-4 py-6">
    <div class="flex items-center mb-6">
      <button class="p-2 mr-2" @click="$router.back()">
        <ChevronLeftIcon :size="24" />
      </button>
      <h1 class="text-xl font-semibold">Settings</h1>
    </div>
    
    <div class="space-y-6">
      <div v-for="(group, index) in settingsGroups" :key="index">
        <h2 class="text-sm text-gray-400 mb-2">{{ group.title }}</h2>
        <div class="bg-gray-800 rounded-lg overflow-hidden">
          <button 
            v-for="(item, itemIndex) in group.items" 
            :key="itemIndex" 
            class="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
          >
            <div class="flex items-center">
              <component :is="item.icon" :size="20" class="text-gray-400 mr-3" />
              <span>{{ item.label }}</span>
            </div>
            <div class="flex items-center text-gray-400">
              <span v-if="item.value" class="mr-2 text-sm">{{ item.value }}</span>
              <ChevronRightIcon :size="16" />
            </div>
          </button>
        </div>
      </div>
      
      <button class="w-full text-red-500 bg-gray-800 rounded-lg p-4 mt-6">
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup>
import { 
  ChevronLeftIcon, 
  BellIcon, 
  GlobeIcon, 
  DollarSignIcon, 
  MoonIcon, 
  UserIcon, 
  ShieldIcon, 
  HelpCircleIcon, 
  ChevronRightIcon 
} from 'lucide-vue-next'

const settingsGroups = [
  {
    title: 'Preferences',
    items: [
      {
        icon: BellIcon,
        label: 'Notifications',
        value: 'On'
      },
      {
        icon: GlobeIcon,
        label: 'Language',
        value: 'English'
      },
      {
        icon: DollarSignIcon,
        label: 'Currency',
        value: 'USD'
      },
      {
        icon: MoonIcon,
        label: 'Dark Mode',
        value: 'On'
      }
    ]
  },
  {
    title: 'Account',
    items: [
      {
        icon: UserIcon,
        label: 'Profile',
        value: 'John Doe'
      },
      {
        icon: ShieldIcon,
        label: 'Privacy',
        value: ''
      },
      {
        icon: HelpCircleIcon,
        label: 'Help & Support',
        value: ''
      }
    ]
  }
]
</script> 