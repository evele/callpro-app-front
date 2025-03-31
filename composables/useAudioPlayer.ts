export const useAudioPlayer = (user_audios: Ref<Audio[]> | Ref<ProcessedAudio[]> | null, from_modal: boolean = false) => {
    const { show_error_toast } = usePrimeVueToast()
    const audiosStore = useAudiosStore();

    const audio_to_play = ref<Audio | null>(null)
    const is_audio_playing = ref(false)
    const is_audio_loading = ref(false)
    const is_audio_paused = ref(false)
    const is_audio_error = ref(false)
    const show_controls = ref(false)

    const reset_states = () => {
        is_audio_playing.value = false
        is_audio_loading.value = false
        is_audio_paused.value = false
        is_audio_error.value = false
    }

    const { data: audioData, isLoading, isError, refetch: getAudioData } = useFetchGetAudio(audio_to_play)

    const audio_fetched = computed<FetchedAudio | null>(() => {
        if(isError.value || !audioData?.value || !audioData.value?.result) {
            return null
        } else {
            if(audio_to_play.value) {
                return audioData.value
            }
            return null
        }
    })

    const handleRefetch = async () => {
        if(audio_to_play.value === null) return
        try {
            const response = await getAudioData();
            if (!response.data?.result) {
                handle_player_action('error');
            }
        } catch (error) {
            handle_player_action('error');
        }
    };

    watch(() => audio_to_play.value, () => {
        audiosStore.audio_playing = null
        if(audio_to_play.value) {
            handleRefetch()
        }
        reset_states()
    })

    watch(
        () => ({ new_audio: audio_fetched.value, isLoading: isLoading.value }),
        ({ new_audio, isLoading }: { new_audio: FetchedAudio | null, isLoading: boolean}) => {
            reset_states()
            if(!new_audio) {
                if(isLoading) return handle_player_action('loading')
                return
            }

            audiosStore.from_modal = from_modal

            if(audio_to_play.value !== null) {
                audiosStore.audio_playing = {
                    id: audio_to_play.value.id,
                    user_id: audio_to_play.value.user_id,
                    name: audio_to_play.value.name,
                    created_at: audio_to_play.value.created_at,
                    last_used: audio_to_play.value.last_used,
                    file_name: audio_to_play.value.file_name,
                    length: audio_to_play.value.length,
                    is_delete: audio_to_play.value.is_delete,
                    full_file_url: new_audio.data.audio_full_url
                }
            }
           
        }
    );

    const select_previous_audio = () => {
        if(!audio_to_play.value || !user_audios || user_audios.value?.length <= 1) return
        audiosStore.audio_playing = null
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === audio_to_play?.value?.id)
        const new_position = (current_position === 0) ? user_audios.value.length - 1 : current_position - 1
        audio_to_play.value = user_audios.value[new_position]

    }

    const select_next_audio = () => {
        if(!audio_to_play.value || !user_audios || user_audios.value?.length <= 1) return
        audiosStore.audio_playing = null
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === audio_to_play?.value?.id)
        const new_position = (current_position === user_audios.value.length - 1) ? 0 : current_position + 1
        audio_to_play.value = user_audios.value[new_position]
    }

    const handle_player_action = (action: PlayerActionTypes) => {
        reset_states()
        switch(action) {
            case 'loading':
                is_audio_loading.value = true
                break
            case 'play':
                is_audio_playing.value = true
                break
            case 'pause':
                is_audio_paused.value = true
                break
            case 'error':
                is_audio_error.value = true
                show_error_toast('Sorry!', "This audio can't be played");
                break
            case 'prev':
                select_previous_audio()
                break
            case 'next':
                select_next_audio()
                break
            case 'close':
                audio_to_play.value = null
                break
            default:
                break
        }
    }

    return { 
        audio_to_play, 
        is_audio_playing, 
        is_audio_loading, 
        is_audio_paused, 
        is_audio_error, 
        show_controls, 
        handle_player_action 
    }
}