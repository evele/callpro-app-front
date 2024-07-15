export const BASE_API_URL = () => {
  const runtimeConfig = useRuntimeConfig()
  const BASE_URL = runtimeConfig.public.PRODUCTION.length ? runtimeConfig.public.PRODUCTION : runtimeConfig.public.DEVELOPMENT
  return BASE_URL
}