import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// const queryClient = new QueryClient()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,  
    // queryClient
  })
}) 
