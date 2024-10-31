<template>
    <div>
        <p class="text-title">Audios Page</p>        
        <span v-if="loadingAllAudios">Loading audios...</span>
        <div v-if="isSuccess && user_audios.length">
            <AudioPlayer :audios="user_audios" />
        </div>

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