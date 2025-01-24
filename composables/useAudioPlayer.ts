export const useAudioPlayer = (user_audios: Ref<Audio[]> | Ref<ProcessedAudio[]> | null) => {
    const { show_error_toast } = usePrimeVueToast()

    const audio_playing = ref<Audio | null>(null)
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

    watch(() => audio_playing.value, (newVal: Audio | null) => {
        console.log(audio_playing.value)
        if(!newVal) {
            audio_playing.value = null
            return
        }
        reset_states()
    })

    const select_previous_audio = () => {
        if(!audio_playing.value || !user_audios || user_audios.value?.length <= 1) return
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === audio_playing?.value?.id)
        const new_position = (current_position === 0) ? user_audios.value.length - 1 : current_position - 1
        audio_playing.value = user_audios.value[new_position]

    }

    const select_next_audio = () => {
        if(!audio_playing.value || !user_audios || user_audios.value?.length <= 1) return
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === audio_playing?.value?.id)
        const new_position = (current_position === user_audios.value.length - 1) ? 0 : current_position + 1
        audio_playing.value = user_audios.value[new_position]
    }

    const handle_player_action = (action: string) => {
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
            default:
                break
        }
    }

    return { 
        audio_playing, 
        is_audio_playing, 
        is_audio_loading, 
        is_audio_paused, 
        is_audio_error, 
        show_controls, 
        handle_player_action 
    }
}