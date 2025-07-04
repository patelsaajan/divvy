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

  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      supabaseRedirectUrl:
        process.env.SUPABASE_REDIRECT_URL ?? "http://localhost:3000",
    },
  },

  supabase: {
    redirect: false,
    types: "./types/database.types.ts",
  },

  modules: ["@nuxt/icon", "@nuxt/ui", "@nuxtjs/supabase", "@nuxtjs/device"],

  nitro: {
    preset: "vercel",
  },
});
