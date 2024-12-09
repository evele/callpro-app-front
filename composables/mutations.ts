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

export const useSaveAudio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (audio_data: AudioToSave) => saveAudio(audio_data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_all_audios'] })
    },
  })
}

export const useDeleteAudio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (audio_data: AudioToDelete) => deleteAudio(audio_data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_all_audios'] })
    },
  })
}

/* ----- Call in codes ----- */
export const useCreateCallInCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:{ is_static: ZeroOrOne }) => fetchWrapper.post(CREATE_CALL_IN_CODE_URL,data),
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
    mutationFn: (data: ContactToSaveData) => saveContact(data)
  })
}

export const useUploadContact = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadContactCSV(data)
  })
}

export const useUploadDNCContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => uploadDNCContactCSV(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dnc_contacts_filtered'] })
    }
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

export const useMoveNumberToGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MoveNumberToGroup) => moveNumberToGroups(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] })
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] })
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
  })
}

export const useAddNumberToGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AddNumberToGroup) => addNumberToGroups(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] })
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] })
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
  })
}

export const useSendNumberToTrash = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SendNumberToTrash) => sendNumberToTrash(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] })
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] })
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
  })
}

export const useAddDNCContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { number: string }) => addDNCContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dnc_contacts_filtered'] })
    }
  })
}

export const useSendContactToTrash = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { number_ids: string[] }) => sendContactToTrash(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dnc_contacts_filtered'] })
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
  })
}

export const useRemoveNumberFromDNC = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { numbers: string[] }) => removeNumberFromDNC(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dnc_contacts_filtered'] })
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

export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GeneralSettingsDataToSave) => updateGeneralSettings(data),
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
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] });
    },
  })
}