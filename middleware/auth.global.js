import { useAuthStore } from "@/stores"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn && to.fullPath != "/login") {
    return navigateTo("/login")
  }
})
