export const BASE_API_URL = () => {
  const runtimeConfig = useRuntimeConfig();

  const environment = runtimeConfig.public.ENVIRONMENT || 'DEVELOPMENT';

  let BASE_URL;
  switch (environment.toUpperCase()) {
    case 'PRODUCTION':
      BASE_URL = runtimeConfig.public.PRODUCTION;
      break;
    case 'TEST':
      BASE_URL = runtimeConfig.public.TEST;
      break;
    case 'DEVELOPMENT':
      BASE_URL = runtimeConfig.public.DEVELOPMENT;
      break;
    default:
      console.warn(`Entorno desconocido: ${environment}. Usando 'DEVELOPMENT' por defecto.`);
      BASE_URL = runtimeConfig.public.DEVELOPMENT;
  }

  return BASE_URL;
};
