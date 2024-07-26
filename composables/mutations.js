import { useMutation, useQueryClient } from '@tanstack/vue-query'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const useCreateCallinCode = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => fetchWrapper.post(CREATE_CALL_IN_CODE_URL,data),
        onSuccess: () => {
        // Invalidate and refetch
        /* TODO: fix this shit that doesn't work
        */
        queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
        },
    }) 
}