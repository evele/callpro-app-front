import { useAuthStore } from "@/stores"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const publicPages = ["/login", "/forgot_password", "/reset_password/","/login_2","/create_user",]
  
  const isPublicPage = publicPages.some(page => to.path.startsWith(page))

  if (!authStore.isLoggedIn && !isPublicPage) {
    return navigateTo("/login")
  }

  if(authStore.isLoggedIn && isPublicPage){
    return navigateTo("/dashboard")
  }
})

