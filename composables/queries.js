import { useQuery } from '@tanstack/vue-query'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Billing ----- */
export const useFetchInvoices = () => {
  return useQuery({
    queryKey: ['user_invoices'],
    queryFn: () => sleep(2000).then(() => fetchWrapper.get(GET_USER_INVOICES_DATA_URL)),
    refetchOnWindowFocus: false,
  })
}

/* ----- Call in codes ----- */
export const useFetchCallInCodes = () => {
  return useQuery({
    queryKey: ['call_in_codes'],
    queryFn: () => sleep(2000).then(() => fetchWrapper.get(GET_USER_CALL_IN_CODES_URL)),  
  })
}

/* ----- Settings ----- */
export const useFetchSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => sleep(2000).then(() => fetchWrapper.get(GET_SETTINGS_DATA_URL)),
    refetchOnWindowFocus: false,
  })
}