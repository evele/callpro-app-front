import { useMutation, useQueryClient } from '@tanstack/vue-query'

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

/* ----- Contacts ----- */
export const useSaveContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ContactToSaveData) => saveContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
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

export const useSaveGroupContacts = () =>{  
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:ContactGroup) => fetchWrapper.post(SAVE_GROUP_CONTACTS_URL, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['group_contacts']})
    },
  })
}