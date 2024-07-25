// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  devtools: { enabled: true },
  modules: ['@pinia/nuxt',"@hebilicious/vue-query-nuxt"],
  app: {
    head: {
      title: "The Callpro App",
      meta: [{ name: "description", content: "The Callpro App Application" }],
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
  vueQuery: {
    // useState key used by nuxt for the vue query state.
    stateKey: "vue-query-nuxt", // default
    // If you only want to import some functions, specify them here.
    // You can pass false or an empty array to disable this feature.
    // default: ["useQuery", "useQueries", "useInfiniteQuery", "useMutation", "useIsFetching", "useIsMutating", "useQueryClient"]
    autoImports: ["useQuery"],
    // Pass the vue query client options here ...
    queryClientOptions: {
      defaultOptions: { queries: { staleTime: 5000 } } // default
    },
    // Pass the vue query plugin options here ....
    vueQueryPluginOptions: {
      enableDevtoolsV6Plugin: true, // enable integrate with the official vue devtools
    }
  }

})
