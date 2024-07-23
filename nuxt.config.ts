// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: "The Callpro App",
      meta: [{ name: "description", content: "The Callpro App Application" }],
      script: [
        { 
          src: "https://cdn.cardknox.com/js/v1/encryptedfields.js", 
          type: "text/javascript"
        },
      ]
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

})
