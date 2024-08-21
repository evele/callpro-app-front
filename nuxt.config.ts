// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@primevue/nuxt-module'],
  primevue: {
    /* Configuration */
    usePrimeVue: true,
    options: {
      unstyled: true
    }
  },
  css: [
    '@/assets/styles/main.scss'
  ],
  app: {
    head: {
      title: "The Callpro App",
      meta: [{ name: "description", content: "The Callpro App Application" }],
      htmlAttrs: {
        "data-theme":"light",
        lang: 'en',
      },
    },
  },
  runtimeConfig: {
    currencyKey: "",
    public: {
      DEVELOPMENT: process.env.NUXT_PUBLIC_DEVELOPMENT_URL,
      PRODUCTION: process.env.NUXT_PUBLIC_PRODUCTION_URL,
    },
  },
  ssr: false,
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  typescript: {
    typeCheck: true,
    strict: true,
  } 
})