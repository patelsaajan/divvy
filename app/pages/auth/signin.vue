<script setup lang="ts">
import { supabase } from "~~/utils/supabase";
import { paths } from "~~/utils/paths";

definePageMeta({ layout: false });

const email = ref("");
const isLoading = ref(false);
const isEmailSent = ref(false);
const errorMsg = ref<string | null>(null);

const signInWithOtp = async () => {
  if (!email.value) return;

  isLoading.value = true;
  errorMsg.value = null;

  const emailRedirectTo = "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      shouldCreateUser: false,
      emailRedirectTo,
    },
  });

  if (error) {
    if (error.status === 422) {
      errorMsg.value =
        "No account found for this email. You may need to create an account.";
    } else {
      errorMsg.value = error.message || "An error occurred. Please try again.";
    }
    isLoading.value = false;
    return;
  } else {
    isEmailSent.value = true;
    isLoading.value = false;
  }
};

const resetForm = () => {
  isEmailSent.value = false;
  email.value = "";
  errorMsg.value = null;
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4"
        >
          <span class="text-2xl">🧾</span>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p class="text-gray-400">Sign in to your Divvy account</p>
      </div>

      <!-- Form Container -->
      <div
        class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
      >
        <!-- Error Alert -->
        <div
          v-if="errorMsg"
          class="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <h3 class="text-red-400 font-medium">Error</h3>
          <p class="text-red-300 text-sm mt-1">{{ errorMsg }}</p>
        </div>

        <!-- Sign In Form -->
        <form
          v-if="!isEmailSent"
          @submit.prevent="signInWithOtp"
          class="space-y-4"
        >
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              v-model="email"
              type="email"
              id="email"
              required
              class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your email"
              :disabled="isLoading"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading || !email"
            class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/70 text-black font-medium py-2 rounded-md transition-colors mt-6"
          >
            {{ isLoading ? "Sending link..." : "Send Magic Link" }}
          </button>

          <p class="text-sm text-gray-400 text-center mt-2">
            We'll email you a magic link for password-free sign in
          </p>
        </form>

        <!-- Email Sent Success -->
        <div v-else class="text-center py-4">
          <div
            class="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6"
          >
            <p class="text-orange-400 font-medium">Check your email</p>
            <p class="text-gray-400 text-sm mt-1">
              We've sent you a magic link to sign in to your account
            </p>
          </div>
          <button
            @click="resetForm"
            class="text-orange-400 hover:text-orange-300 text-sm"
          >
            Use a different email address
          </button>
        </div>

        <!-- Sign Up Link -->
        <div class="mt-6 pt-6 border-t border-gray-700/50">
          <p class="text-center text-sm text-gray-400">
            Don't have an account?
            <NuxtLink
              :to="paths.auth.signup"
              class="text-orange-400 hover:text-orange-300"
            >
              Create one now
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
