import { useMutation, useQueryClient } from '@tanstack/vue-query'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Audios ----- */
export const useConvertTextToSpeech = () => {
  return useMutation({
    mutationFn: (data) => fetchWrapper.post(CONVERT_TEXT_TO_SPEECH_URL, data),
  }) 
}

/* ----- Call in codes ----- */
export const useCreateCallInCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => fetchWrapper.post(CREATE_CALL_IN_CODE_URL,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
    },
  }) 
}

export const useDeleteCallInCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => fetchWrapper.post(DELETE_CALL_IN_CODE_URL,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
    },
  }) 
}

/* ----- Settings ----- */
export const useUpdateVoiceSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => fetchWrapper.post(UPDATE_VOICE_SETTINGS_URL,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  }) 
}

export const useUpdateTextSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => fetchWrapper.post(UPDATE_TEXT_SETTINGS_URL,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  }) 
}