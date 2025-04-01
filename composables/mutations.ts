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

export const useUploadAudio = () => {
  return useMutation({
    mutationFn: (audio_data: FormData) => uploadAudio(audio_data),
  })
}

/* ----- Billing ----- */
export const useSaveDefaultCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:{ card_id: number }) => saveDefaultCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_cc_cards'] })
    },
  }) 
}

export const useSaveBillingSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SaveBillingSettingsData) => saveBillingSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_billing_settings'] })
    },
  })
}

export const useSetPendingDowngrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PendingDowngradeData) => setPendingDowngrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_billing_data'] })
    },
  }) 
}

export const useCancelDowngrade = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => cancelDowngrade(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_billing_data'] })
    },
  }) 
}


/* ----- Broadcast ----- */
export const useSaveSelectedGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SaveSelectedGroupParams) => saveSelectedGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_numbers_selected'] })
    },
  }) 
}

/* ----- Call in codes ----- */
export const useCreateCallInCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:{ is_static: ZeroOrOne }) => createCallInCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
    },
  }) 
}

export const useDeleteCallInCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { call_in_code_id: number }) => deleteCallInCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
    },
  }) 
}

/* ----- Caller ID ----- */
export const useSaveCallerIDNumber = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:{ caller_id: string }) => saveCallerIDNumber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caller_id_numbers'] })
    },
  }) 
}

export const useVerifyCallerIDNumber = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:CallerIDToVerify) => verifyCallerIDNumber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caller_id_numbers'] })
    },
  }) 
}

export const useDeleteCallerIDNumber = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:CallerIDToDelete) => deleteCallerIDNumber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caller_id_numbers'] })
    },
  }) 
}

/* ----- Contacts ----- */
export const useSaveContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ContactToSaveData) => saveContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] });
    }
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

export const useSaveGroupContacts = () =>{  
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data:ContactGroup) => saveGroupContacts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['group_contacts']})
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] });
      queryClient.invalidateQueries({ queryKey: ['system_groups'] });
    },
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

export const useRemoveNumberFromGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RemoveNumberFromGroup) => RemoveNumberfromGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] })
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] })
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
  })
}

export const useDeleteUserGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GroupToDelete) => deleteUserGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] })
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] })
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
      queryClient.invalidateQueries({ queryKey: ['system_groups'] });
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

export const useDeleteContactForever = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NumberIdArray) => deleteContactForever(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] })
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] })
      queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
    }
  })
}

export const useRestoreContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NumberIdArray) => restoreContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_groups'] })
      queryClient.invalidateQueries({ queryKey: ['custom_groups'] })
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

export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GeneralSettingsDataToSave) => updateGeneralSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  }) 
}