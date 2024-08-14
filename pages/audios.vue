<template>
    <div>
        <p class="text-title">Audios page</p>
        <button type="button" @click="load_audios">Load audios</button>
        <span v-if="loadingAllAudios">Loading audios...</span>
        <ul v-if="isSuccess">
            <li v-for="audio in allAudiosData?.audios" :key="audio.id">
                {{ audio?.id }} - {{ audio?.name }}
            </li>
        </ul> 
        <div class="container-div">
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

<script setup>
    import { useAudiosStore } from "@/stores"
    import { useQueryClient, useQuery } from '@tanstack/vue-query'

    const queryClient = useQueryClient()

    
    const text_to_convert = ref('')
    const isLoading = ref(false)
    
    const audio_id = ref(null)
    const audio_url = ref(null)
    
    
    const show_older = ref(false)
    
    const { data: allAudiosData, isLoading: loadingAllAudios, isSuccess, refetch } = useFetchGetAllAudios(show_older)

    const { mutate: createTextToSpeech, isPending: isConverting } = useConvertTextToSpeech()
    

    const load_audios = () => {
        // refetch() // not needed, but works
        
    }

    const convert_Text = async () => {
        audio_id.value = null
        audio_url.value = null

        if(text_to_convert.value.trim() === '') {
            alert('Please write some text to convert.')
            return
        }

        const dataToSend = {
            text: text_to_convert.value.trim(),
            temp: 'false'
        }

        createTextToSpeech(dataToSend, {
            onSuccess: (data) => {
                audio_id.value = PREVIEW_TTS
                audio_url.value = data.full_file_url
            }
        })
        
    }

    const fetch_audio_data = () => {
        const dataToSend = {
            audio_id: audio_id.value,
            audio_full_url: audio_url.value,
            called_from: CALLPRO_APP_FRONT
        }
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