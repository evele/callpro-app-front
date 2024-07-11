export const BASE_API_URL = () => {
  const runtimeConfig = useRuntimeConfig()
  const BASE_URL = runtimeConfig.public.PRODUCTION.length ? runtimeConfig.public.PRODUCTION : runtimeConfig.public.DEVELOPMENT
  return BASE_URL
}

export const LOGIN_URL = () => {
  return `${BASE_API_URL()}/jwtauth/login`
}

export const RECOVERY_MAIL_URL = () => {
  return `${BASE_API_URL()}/jwtauth/send_recovery_mail`
}

export const RESET_PASSWORD_URL = () => {
  return `${BASE_API_URL()}/jwtauth/reset_password`
}

export const LOAD_SETTINGS_DATA_URL = () => {
  return `${BASE_API_URL()}/settings/get_settings_data`
}
