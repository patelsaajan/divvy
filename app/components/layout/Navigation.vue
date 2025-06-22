<template>
  <nav
    class="fixed mt-6 bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-lg py-2 px-4 border-t border-gray-700/50 z-30"
  >
    <div class="flex justify-around items-center">
      <NuxtLink
        :to="paths.home"
        class="flex flex-col items-center p-2 rounded-md text-gray-400 hover:text-white transition-colors"
        active-class="text-orange-500"
      >
        <ReceiptIcon :size="24" />
        <span class="text-xs mt-1">Receipts</span>
      </NuxtLink>

      <NuxtLink
        :to="paths.upload"
        class="flex flex-col items-center p-2 rounded-md text-gray-400 hover:text-white transition-colors"
        active-class="text-orange-500"
      >
        <UploadIcon :size="24" />
        <span class="text-xs mt-1">Upload</span>
      </NuxtLink>

      <NuxtLink
        :to="paths.settings"
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
import { ReceiptIcon, SettingsIcon, UploadIcon } from "lucide-vue-next";
import { paths } from "~~/utils/paths";
</script>
