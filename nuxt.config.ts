// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  devtools: { enabled: true },
  // modules: ['@pinia/nuxt',"@hebilicious/vue-query-nuxt"],
  modules: ['@pinia/nuxt', '@primevue/nuxt-module'],
  primevue: {
    /* Configuration */
    usePrimeVue: true,
    options: {
      unstyled: true
    }
  },
  css: [
    '@/assets/main.scss', // Adjust the path if you named your file differently
  ],
  app: {
    head: {
      title: "The Callpro App",
      meta: [{ name: "description", content: "The Callpro App Application" }],
      // script: [
      //   {
      //     src: 'https://cdn.cardknox.com/js/v1/encryptedfields.js',
      //     async: true,
      //     defer: true,
      //   },
      // ],
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