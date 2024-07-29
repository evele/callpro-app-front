import { useMutation, useQueryClient } from '@tanstack/vue-query'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Audios ----- */
export const useFetchGetAllAudios = () => {
  return useMutation({
    mutationFn: data => sleep(500).then(() => fetchWrapper.post(GET_AUDIOS_URL, data))
  })
}

/* ----- Billing ----- */
export const useFetchInvoiceToPrint = () => {
  return useMutation({
    mutationFn: data => sleep(500).then(() => fetchWrapper.post(GET_INVOICE_DATA_TO_PRINT_URL, data))
  })
}

/* ----- Call in codes ----- */
export const useCreateCallinCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => fetchWrapper.post(CREATE_CALL_IN_CODE_URL,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
    },
  }) 
}