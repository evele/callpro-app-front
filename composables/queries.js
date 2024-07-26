import { useQuery } from '@tanstack/vue-query'

export const useFetchSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => fetchWrapper.get(GET_SETTINGS_DATA_URL) ,  
  })
}

