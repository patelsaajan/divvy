import { paths } from "~~/utils/paths";

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for static assets
  if (
    to.path.startsWith("/_nuxt/") ||
    to.path.startsWith("/_ipx/") ||
    to.path.startsWith("/favicon.ico")
  ) {
    return;
  }

  const supabase = useSupabaseClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is signed in and trying to access auth pages, redirect to home
  if (user && to.path.includes("/auth/")) {
    return navigateTo(paths.home);
  }

  // If user is not signed in and trying to access /api routes, return 401
  if (!user && to.path.startsWith("/api/")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // If user is not signed in, redirect to sign in
  if (!user && !to.path.includes("/auth/")) {
    return navigateTo(paths.auth.signin);
  }
});
