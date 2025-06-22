// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-06-21",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    types: "./types/database.types.ts",
    redirect: false, // redirect to login page if not authenticated
  },

  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/supabase",
  ],
});
