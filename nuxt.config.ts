import { MyPreset } from './my_theme';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-17',
  devServer: {
    port: 3001,
  },
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@primevue/nuxt-module'],
  primevue: {
    /* Configuration */
    options: {
      theme: {
          preset: MyPreset,
          options: {
            darkModeSelector: 'light',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
      }
    }
  },
  css: [
    '@/assets/css/main.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
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
      DEVELOPMENT: process.env.NUXT_PUBLIC_DEVELOPMENT_URL || '',
      TEST: process.env.NUXT_PUBLIC_TEST_URL || '',
      PRODUCTION: process.env.NUXT_PUBLIC_PRODUCTION_URL || '',
      ENVIRONMENT: process.env.NUXT_ENV || 'development'
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