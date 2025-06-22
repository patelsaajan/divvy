<script setup lang="ts">
import type { VerifyOtpParams } from "@supabase/supabase-js";
import { paths } from "~~/utils/paths";
import { supabase } from "~~/utils/supabase";

definePageMeta({ layout: false });

const route = useRoute();
const { token_hash, type, next } = route.query;

// Server-side OTP verification
if (process.server) {
  if (token_hash && type) {
    try {
      // Use the server-side Supabase client
      const config = useRuntimeConfig();

      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      } as VerifyOtpParams);

      if (!error) {
        // Redirect user to specified redirect URL or root of app
        const redirectTo = next || paths.home;
        await navigateTo(redirectTo as string, { redirectCode: 302 });
      } else {
        // Redirect to error page
        await navigateTo(paths.auth.error, { redirectCode: 302 });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      await navigateTo(paths.auth.error, { redirectCode: 302 });
    }
  } else {
    // Missing required parameters, redirect to error page
    await navigateTo(paths.auth.error, { redirectCode: 302 });
  }
}

// Client-side fallback
const user = useSupabaseUser();
const isLoading = ref(true);
const error = ref<string | null>(null);

// Watch for user authentication
watch(
  user,
  () => {
    if (user.value) {
      // User is authenticated, redirect to dashboard
      const redirectTo = next || paths.home;
      navigateTo(redirectTo as string);
    }
  },
  { immediate: true }
);

// Handle the confirmation on client side if server-side failed
onMounted(async () => {
  if (!token_hash || !type) {
    error.value = "Invalid confirmation link";
    isLoading.value = false;
    return;
  }

  try {
    const { error: otpError } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    } as VerifyOtpParams);

    if (otpError) {
      error.value = otpError.message;
    }
  } catch (err) {
    error.value = "Failed to verify email";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md text-center">
      <!-- Logo -->
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4"
      >
        <span class="text-2xl">🧾</span>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <h1 class="text-2xl font-bold text-white">Verifying your email...</h1>
        <div class="flex justify-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"
          ></div>
        </div>
        <p class="text-gray-400">Please wait while we verify your account</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="space-y-4">
        <h1 class="text-2xl font-bold text-white">Verification Failed</h1>
        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>
        <NuxtLink
          :to="paths.auth.signin"
          class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </NuxtLink>
      </div>

      <!-- Success State (should redirect automatically) -->
      <div v-else class="space-y-4">
        <h1 class="text-2xl font-bold text-white">Email Verified!</h1>
        <p class="text-gray-400">Redirecting you to the dashboard...</p>
      </div>
    </div>
  </div>
</template>
