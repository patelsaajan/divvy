<template>
  <PageHeader title="Settings" />

  <div class="px-4">
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
              <UIcon :name="item.icon" :size="20" class="text-gray-400 mr-3" />
              <span>{{ item.label }}</span>
            </div>
            <div class="flex items-center text-gray-400">
              <span v-if="item.value" class="mr-2 text-sm">{{
                item.value
              }}</span>
              <UIcon name="i-heroicons-chevron-right" :size="16" />
            </div>
          </button>
        </div>
      </div>

      <button
        @click="handleSignOut"
        :disabled="isSigningOut"
        class="w-full text-red-500 bg-gray-800 rounded-lg p-4 mt-6 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ isSigningOut ? "Signing out..." : "Sign Out" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { settingsGroups } from "~~/dummyData/settings";
import { paths } from "~~/utils/paths";

const supabase = useSupabaseClient();
const toast = useToast();
const isSigningOut = ref(false);

const handleSignOut = async () => {
  isSigningOut.value = true;

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.add({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        color: "red",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    // Redirect to sign in page after successful sign out
    await navigateTo(paths.auth.signin);
  } catch (error) {
    toast.add({
      title: "Sign Out Error",
      description: "An unexpected error occurred while signing out.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isSigningOut.value = false;
  }
};
</script>
