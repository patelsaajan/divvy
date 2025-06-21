<template>
  <div class="px-4 py-6">
    <div class="flex items-center mb-6">
      <button class="p-2 mr-2" @click="$router.back()">
        <ChevronLeftIcon :size="24" />
      </button>
      <h1 class="text-xl font-semibold">Upload Receipt</h1>
    </div>
    
    <div class="flex flex-col items-center justify-center h-96">
      <div class="border-2 border-dashed border-gray-600 rounded-lg p-8 w-full max-w-sm flex flex-col items-center">
        <CameraIcon :size="48" class="text-gray-500 mb-4" />
        <p class="text-center mb-4 text-gray-400">
          Take a photo or upload an image of your receipt
        </p>
        <div class="flex space-x-4">
          <label class="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer">
            Take Photo
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              class="hidden" 
              @change="handleUpload" 
            />
          </label>
          <label class="px-4 py-2 bg-gray-700 text-white rounded-md cursor-pointer">
            Upload
            <input 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleUpload" 
            />
          </label>
        </div>
      </div>
    </div>
    
    <div v-if="isUploading" class="mt-8 flex flex-col items-center">
      <div class="w-full max-w-xs bg-gray-800 rounded-lg p-4">
        <div class="flex items-center mb-2">
          <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
            <CameraIcon :size="16" class="text-white" />
          </div>
          <span>Uploading...</span>
        </div>
        <div class="w-full bg-gray-700 h-2 rounded-full">
          <div class="bg-orange-500 h-2 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, CameraIcon } from 'lucide-vue-next'

const isUploading = ref(false)

const handleUpload = (e) => {
  e.preventDefault()
  isUploading.value = true
  // Simulate upload process
  setTimeout(() => {
    isUploading.value = false
    navigateTo('/expense/new')
  }, 2000)
}
</script> 