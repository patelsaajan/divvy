<template>
  <nav class="absolute mt-6 bottom-0 left-0 right-0 bg-gray-800 py-2 px-4">
    <div class="flex justify-around items-center">
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center p-2 rounded-md text-gray-400 hover:text-white transition-colors"
        active-class="text-orange-500"
      >
        <ReceiptIcon :size="24" />
        <span class="text-xs mt-1">Expenses</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/upload-receipt" 
        class="flex flex-col items-center p-2 rounded-md text-gray-400 hover:text-white transition-colors"
        active-class="text-orange-500"
      >
        <UploadIcon :size="24" />
        <span class="text-xs mt-1">Upload</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/settings" 
        class="flex flex-col items-center p-2 rounded-md text-gray-400 hover:text-white transition-colors"
        active-class="text-orange-500"
      >
        <SettingsIcon :size="24" />
        <span class="text-xs mt-1">Settings</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ReceiptIcon, UploadIcon, SettingsIcon } from 'lucide-vue-next'
</script> 