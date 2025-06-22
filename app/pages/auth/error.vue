<script setup lang="ts">
import { paths } from "~~/utils/paths";

definePageMeta({ layout: false });
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md text-center">
      <!-- Logo -->
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4"
      >
        <span class="text-2xl">⚠️</span>
      </div>

      <h1 class="text-2xl font-bold text-white mb-4">Authentication Error</h1>

      <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
        <p class="text-red-300 mb-4">
          We encountered an issue while verifying your email address. This could
          be due to:
        </p>
        <ul class="text-red-300 text-sm space-y-2 text-left">
          <li>• The verification link has expired</li>
          <li>• The link has already been used</li>
          <li>• The link is invalid or corrupted</li>
        </ul>
      </div>

      <div class="space-y-4">
        <NuxtLink
          :to="paths.auth.signin"
          class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full"
        >
          Sign In Again
        </NuxtLink>

        <NuxtLink
          :to="paths.auth.signup"
          class="inline-block bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full"
        >
          Create New Account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
