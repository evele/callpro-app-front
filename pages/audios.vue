<template>
    <div>
        <p class="text-title">Audios page</p>
        <button type="button" @click="load_numbers">Load audios</button>
        <div class="container-div">
            <p>Show older audios</p>
            <input type="checkbox" v-model="show_older">
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

    const audiosStore = useAudiosStore()
    const show_older = ref(false)
    const text_to_convert = ref('')
    const isConverting = ref(false)
    const isLoading = ref(false)

    const audio_id = ref(null)
    const audio_url = ref(null)

    onMounted(async() => {
        await audiosStore.getAudios()
    })
    
    const load_numbers = () => {
        audiosStore.getAudios(show_older.value)   
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

        isConverting.value = true
        const res = await audiosStore.convertTextToSpeech(dataToSend)
        isConverting.value = false

        if(res.result) {
            audio_id.value = 'preview_tts'
            audio_url.value = res.data.full_file_url
        } else {
            console.log(res.db_error)
        }
    }

    const fetch_audio_data = async () => {
        const dataToSend = {
            audio_id: audio_id.value,
            audio_full_url: audio_url.value,
            called_from: "callpro-app-front"
        }

        isLoading.value = true
        const res = await audiosStore.getAudio(dataToSend)
        isLoading.value = false

        if(res.result) {
            console.log(res.data)
        } else {
            console.log(res.db_error)
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