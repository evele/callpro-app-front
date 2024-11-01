<template>
    <div>
        <p class="text-title">Audios Page</p>        
        <span v-if="loadingAllAudios">Loading audios...</span>
        <div v-if="isSuccess && user_audios.length">
            <AudioPlayer :audios="user_audios" />
        </div>

        <ul v-if="isSuccess && user_audios.length" class="ml-2">
            <li v-for="audio in user_audios" :key="audio.id" class="mb-2 flex gap-2 items-center">
                <span>{{ audio.name }}</span>
                <Button @click="select_audio(audio)" class="bg-transparent border-none text-black p-1 hover:bg-gray-300">
                    <AudioSVG />            
                </Button>
                <span v-if="selected_audio && is_audio_loading && selected_audio.id === audio.id">Loading...</span>
                <span v-else-if="selected_audio && is_audio_error && selected_audio.id === audio.id">This track can't be played</span>
                <span v-else-if="selected_audio && is_audio_playing && selected_audio.id === audio.id">Playing...</span>
                <span v-else-if="selected_audio && is_audio_paused && selected_audio.id === audio.id">Paused</span>
            </li>
        </ul>

        <AudioPlayer :current-audio="selected_audio" @action="handle_player_action" />

        <div class="container-div mt-10">
            <label>Show older audios
                <input type="checkbox" v-model="show_older">
            </label>
        </div>
        <div>
            <h3>Write some text and convert it to speech.</h3>
            <textarea cols="50" rows="10" v-model="text_to_convert" />
            <button type="button" @click="convert_Text" class="btn-convert" :disabled="isConverting">
                {{ isConverting ? 'Converting...' : 'Convert' }}
            </button>
        </div>
        <div v-if="audio_id">
            <h4>Preview the converted file</h4>
            <button type="button" @click="fetch_audio_data" :disabled="isLoading">
                {{ isLoading ? 'Loading...' : 'Load audio' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    const text_to_convert = ref('')
    const isLoading = ref(false)
    
    const audio_id: Ref<string | null> = ref(null);
    const audio_url: Ref<string | null> = ref(null);    
    
    const show_older = ref(false)
    
    const { data: allAudiosData, isLoading: loadingAllAudios, isSuccess, refetch } = useFetchGetAllAudios(show_older)
    const { mutate: createTextToSpeech, isPending: isConverting } = useConvertTextToSpeech()
    const { data: audioData, refetch: refetchAudioData } = useFetchGetAudio(audio_id, audio_url, CALLPRO_APP_FRONT)

    /* ----- Audio Player ----- */
    const user_audios = computed(() => {
        if(allAudiosData.value && allAudiosData.value.result) return allAudiosData.value.audios
        return []
    })

    const selected_audio = ref<Audio | null>(null)
    const is_audio_playing = ref(false)
    const is_audio_loading = ref(false)
    const is_audio_paused = ref(false)
    const is_audio_error = ref(false)

    const reset_states = () => {
        is_audio_playing.value = false
        is_audio_loading.value = false
        is_audio_paused.value = false
        is_audio_error.value = false
    }

    const select_audio = (audio: Audio) => {
        reset_states()
        selected_audio.value = audio
    }

    const select_previous_audio = () => {
        if(!selected_audio.value) return
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === selected_audio?.value?.id)
        const new_position = (current_position === 0) ? user_audios.value.length - 1 : current_position - 1
        selected_audio.value = user_audios.value[new_position]
    }

    const select_next_audio = () => {
        if(!selected_audio.value) return
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === selected_audio?.value?.id)
        const new_position = (current_position === user_audios.value.length - 1) ? 0 : current_position + 1
        selected_audio.value = user_audios.value[new_position]
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
    /* ----- Audio Player ----- */

    const convert_Text = async () => {
        audio_id.value = null
        audio_url.value = null

        if(text_to_convert.value.trim() === '') {
            alert('Please write some text to convert.')
            return
        }

        const dataToSend = {
            text: text_to_convert.value.trim(),
            temp: false
        }

        createTextToSpeech(dataToSend, {
            onSuccess: (data:Tts_Convert) => {                
                audio_id.value = PREVIEW_TTS
                audio_url.value = data.full_file_url
            }
        })
        
    }

    const fetch_audio_data = () => {
        refetchAudioData()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .container-div {
        display: flex;
        align-items: center;
        font-size: 18px;
    }
    .btn-convert {
        padding: .7rem 1.2rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 1rem;
    }
    textarea {
        display: block;
        margin-bottom: 1rem;
    }
</style>