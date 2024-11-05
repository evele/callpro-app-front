<template>
    <div class="p-6">
        <p class="text-title">Audios Page</p>        
        <span v-if="loadingAllAudios">Loading audios...</span>
        <Card class="bg-white">
            <template #content>
                <section class="flex flex-wrap gap-10">
                    <ButtonLibrary @click="handle_lbry_btn_action('upload')">
                        <Avatar class="bg-[#E8DEF8] mb-2" size="xlarge" shape="circle">
                            <UploadAudioSVG class="w-8 h-8 text-gray-500 text-[#4F378B]" />
                        </Avatar>
                        <p>Upload</p>
                        <p>an audio</p>
                    </ButtonLibrary>
                    <ButtonLibrary @click="handle_lbry_btn_action('tts')">
                        <Avatar class="bg-[#CFF7D3] mb-2" size="xlarge" shape="circle">
                            <TextSVG class="w-8 h-8 text-gray-500 text-[#009951]" />
                        </Avatar>
                        <p>Add Text to</p>
                        <p>Speech (TTS)</p>
                    </ButtonLibrary>
                    <ButtonLibrary @click="handle_lbry_btn_action('call')">
                        <Avatar class="bg-[#fff1c2] mb-2" size="xlarge" shape="circle">
                            <CallInSVG class="w-7 h-7 text-gray-500 text-[#E5A000]" />
                        </Avatar>
                        <p>Call In</p>
                        <p>audio</p>
                    </ButtonLibrary>
                </section>
                <main>
                    <ul v-if="isSuccess  && allAudiosData && 'audios' in allAudiosData" class="ml-2 is-flex is-flex-direction-column is-gap-1">
                        <li v-if="allAudiosData?.audios?.length" v-for="audio in allAudiosData?.audios" :key="audio?.id" class="is-flex is-gap-2">
                            <span class="mt-3 has-text-weight-semibold has-text-primary is-size-5">{{ audio?.name }}</span>
                            <AudioPlayer :audioUrl="audio?.full_file_url" />
                        </li>
                    </ul>
                </main>
            </template>  
        </Card>
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

<script setup lang="ts">
    import { useQueryClient, useQuery } from '@tanstack/vue-query'

    const queryClient = useQueryClient()

    const text_to_convert = ref('')
    const isLoading = ref(false)
    
    const audio_id: Ref<string | null> = ref(null);
    const audio_url: Ref<string | null> = ref(null);    
    
    
    const show_older = ref(false)
    
    const { data: allAudiosData, isLoading: loadingAllAudios, isSuccess, refetch } = useFetchGetAllAudios(show_older)
    const { mutate: createTextToSpeech, isPending: isConverting } = useConvertTextToSpeech()
    const { data: audioData, refetch: refetchAudioData } = useFetchGetAudio(audio_id, audio_url, CALLPRO_APP_FRONT)

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

    const handle_lbry_btn_action = (action: string) => {
        switch(action) {
            case 'upload':
                console.log('upload')
                break
            case 'tts':
                console.log('tts')
                break
            case 'call':
                console.log('call')
                break
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