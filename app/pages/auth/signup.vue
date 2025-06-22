<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4"
        >
          <span class="text-2xl">🧾</span>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Create your account</h1>
        <p class="text-gray-400">Join Divvy to start managing your expenses</p>
      </div>

      <!-- Sign Up Form -->
      <div
        class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
      >
        <!-- Error Alert -->
        <div
          v-if="errorMsg"
          class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <h3 class="text-red-400 font-medium">Error</h3>
          <p class="text-red-300 text-sm mt-1">{{ errorMsg }}</p>
        </div>

        <form @submit.prevent="signUpWithOtp" class="space-y-6">
          <!-- Name Input -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Full name
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <UIcon name="i-heroicons-user" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                class="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Email address
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="h-5 w-5 text-gray-400"
                />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start space-x-3">
            <input
              id="terms"
              v-model="acceptedTerms"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
              :disabled="isLoading"
            />
            <label for="terms" class="text-sm text-gray-300">
              I agree to the
              <a
                href="#"
                class="text-orange-500 hover:text-orange-400 font-medium"
                >Terms of Service</a
              >
              and
              <a
                href="#"
                class="text-orange-500 hover:text-orange-400 font-medium"
                >Privacy Policy</a
              >
            </label>
          </div>

          <!-- Create Account Button -->
          <button
            type="submit"
            :disabled="isLoading || !email || !name || !acceptedTerms"
            class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <UIcon
              v-if="isLoading"
              name="i-heroicons-arrow-path"
              class="h-5 w-5 animate-spin"
            />
            <UIcon v-else name="i-heroicons-user-plus" class="h-5 w-5" />
            <span>{{
              isLoading ? "Creating account..." : "Create account"
            }}</span>
          </button>
        </form>

        <!-- Sign In Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Already have an account?
            <NuxtLink
              :to="paths.auth.signin"
              class="text-orange-500 hover:text-orange-400 font-medium transition-colors duration-200"
            >
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Account Created Modal -->
      <div
        v-if="showAccountCreated"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click="showAccountCreated = false"
      >
        <div
          class="bg-gray-800 rounded-2xl p-6 max-w-sm w-full border border-gray-700"
          @click.stop
        >
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4"
            >
              <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-400" />
            </div>
            <h3 class="text-lg font-medium text-white mb-2">
              Account created!
            </h3>
            <p class="text-gray-400 mb-4">
              We've sent a verification link to
              <span class="text-white font-medium">{{ email }}</span>
            </p>
            <p class="text-sm text-gray-500 mb-6">
              Click the link in your email to verify your account and start
              using Divvy.
            </p>
            <button
              @click="showAccountCreated = false"
              class="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { paths } from "~~/utils/paths";

definePageMeta({ layout: false });

const supabase = useSupabaseClient();

const name = ref("");
const email = ref("");
const acceptedTerms = ref(false);
const isLoading = ref(false);
const showAccountCreated = ref(false);
const isEmailSent = ref(false);
const errorMsg = ref<String | null>(null);
const config = useRuntimeConfig();

const signUpWithOtp = async () => {
  if (!email.value) return;

  isLoading.value = true;
  errorMsg.value = null;

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: config.public.supabaseRedirectUrl as string,
      data: {
        display_name: name.value,
      },
    },
  });

  if (error) {
    if (error.status === 400) {
      errorMsg.value = "Please enter a valid email address";
    } else if (error.status === 409) {
      errorMsg.value = "Email already in use";
    } else {
      errorMsg.value = error.message || "An error occurred. Please try again.";
    }
    isLoading.value = false;
    return;
  }

  isEmailSent.value = true;
  showAccountCreated.value = true;
  isLoading.value = false;
};
</script>
