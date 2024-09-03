import { useMutation, useQueryClient } from '@tanstack/vue-query'

/* ----- Audios ----- */
export const useConvertTextToSpeech = () => {
  return useMutation<Tts_Convert, unknown, TextToConvert>({
    mutationFn: async (data: TextToConvert): Promise<Tts_Convert> => {
      const response = await fetchWrapper.post(CONVERT_TEXT_TO_SPEECH_URL, data);
      return response as Tts_Convert;
    },
  });
}

/* ----- Call in codes ----- */
export const useCreateCallInCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:{ is_static: 0 | 1 }) => fetchWrapper.post(CREATE_CALL_IN_CODE_URL,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
    },
  }) 
}

export const useDeleteCallInCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { call_in_code_id: number }) => fetchWrapper.post(DELETE_CALL_IN_CODE_URL,data),
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

export const useUploadContact = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadContactCSV(data)
  })
}

export const useSaveUploadedContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: uploadedContactToSaveData) => saveUploadedContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
  })
}

/* ----- Settings ----- */
export const useUpdateVoiceSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: VoiceSettingsDataToSave) => updateVoiceSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  }) 
}

export const useUpdateTextSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TextSettingsDataToSave) => updateTextSettings(data),
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