<template>
    <div class="flex flex-col gap-[38px]">
        <InfoPanel>Type
            the message here to have it converted to audio.
        </InfoPanel>  
        <textarea v-model="text_to_convert" placeholder="Enter text"
            class="h-24 px-4 py-3 bg-white rounded-[10px] border border-[#d9d9d9] text-dark-3 text-base font-normal">
        </textarea>          
        <!-- area preview aduio conver -->
               
        <Button 
            type="button" 
            @click="convert_Text"
            class="w-[170px] px-10 py-[9px] bg-white rounded-xl shadow-lg text-center text-sm font-medium text-dark-3 border-[#767676] hover:bg-gray-200 disabled:bg-white"
            :disabled="isConverting"
        >
            {{ isConverting ? 'Converting...' : 'Convert' }}
        </Button>                

        <ul v-if="convertedAudios?.length" class="ml-2">

            <li v-for="(audio, index) in convertedAudios" :key="index">
                <!-- area preview aduio conver -->
                <div class="py-[5px] justify-start items-center gap-[30px] inline-flex">
                    <!-- Condicional para mostrar el nombre o el input -->
                    <div v-if="editingIndex === index" class="flex flex-col justify-start items-start gap-2">
                        <p class="text-dark-3">Audio Name</p>
                        <!-- input and close -->
                        <div class="flex flex-row items-center gap-[29px]">
                            <!-- Input editable para cambiar el nombre -->
                            <InputText 
                                type="text" 
                                id="tts-audio-name" 
                                v-model="audioNameTemp" 
                                @blur="saveAudioName(index)"
                                @keyup.enter="saveAudioName(index)"
                                class="text-dark-3 w-fit sm:w-[330px]" 
                            />
                           
                            <!-- Botón CloseSVG para cancelar la edición -->
                            <div @click="cancelEditing()" class="w-6 h-6 p-1 bg-[#e7e0ec] rounded-[10px] flex justify-center items-center cursor-pointer">
                                <CloseSVG class="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <!-- Mostrar el nombre si no está en modo de edición -->
                    <div v-else @click="startEditing(index, audio.name)"
                        class="text-[#65558f] font-['Inter'] underline cursor-pointer">
                        {{ audio.name }}
                    </div>

                    <!-- Bloque de botones (Play, Download, Edit, Trash) si no está en modo de edición -->
                    <div v-if="editingIndex !== index"
                        class="w-[138px] py-px justify-center items-center gap-3.5 flex">
                        <!-- play -->
                        <Button 
                            type="button" 
                            class="w-6 h-6 bg-[#653494] rounded-[12px] justify-center items-center flex hover:scale-110 transition-transform"
                            @click="handle_play_audio(audio)"
                            :disabled="is_audio_loading"
                        >
                            <template #icon>
                                <PlaySVG class="w-6 h-6 bg-[#653494] text-white rounded-[10px]" />
                            </template>
                        </Button>
                        <!-- download -->
                        <Button 
                            type="button" 
                            class="w-6 h-6 bg-[#e7e0ec] rounded-[12px] text-[#1D1B20] border-none hover:scale-110 transition-transform"
                            @click="handle_download_audio(audio.file_name)"    
                        >
                            <template #icon>
                                <DownloadSVG class="w-5 h-5 relative bg-[#e7e0ec] rounded-[10px]" />
                            </template>
                        </Button>
                        <!-- edit -->
                        <Button @click="startEditing(index, audio.name)" class="w-6 h-6 bg-[#e7e0ec] rounded-[12px] text-[#1D1B20] border-none hover:scale-110 transition-transform">
                            <template #icon>
                                <EditIconSVG class="w-4 h-4 relative bg-[#e7e0ec] rounded-[10px]" />
                            </template>
                        </Button>
                        <!-- trash -->
                        <Button 
                            type="button"
                            class="w-6 h-6 bg-[#e7e0ec] rounded-[12px] text-[#1D1B20] border-none hover:scale-110 transition-transform"
                            @click="handle_delete(audio.file_name)" 
                            :disabled="is_audio_loading"    
                        >
                            <template #icon>
                                <TrashSVG class="w-5 h-5 relative bg-[#e7e0ec] rounded-[10px]" />
                            </template>
                        </Button>
                    </div>
                    <p v-show="is_audio_loading && audio_to_play_hook?.file_name == audio.file_name">Loading audio...</p>
                </div>
            </li>
        </ul>
    </div>

    <footer class="flex justify-center w-full font-bold mt-[38px]">
        <Button @click="save_audios" type="button" class="w-[300px]" :disabled="disabled_save_btn">
            {{ isPendingSave ? 'Saving...' : 'Save' }}
        </Button>
    </footer>

    <Teleport to="body">
        <AudioPlayer :current-audio="audio_playing" @action="handle_player_action" :from-modal="true" />
    </Teleport>
</template>

<script setup lang="ts">
import InfoPanel from '~/components/reusables/InfoPanel.vue';
import CloseSVG from '~/components/svgs/CloseSVG.vue';
import DownloadSVG from '~/components/svgs/DownloadSVG.vue';
import EditIconSVG from '~/components/svgs/EditIconSVG.vue';
import PlaySVG from '~/components/svgs/PlaySVG.vue';
import TrashSVG from '~/components/svgs/TrashSVG.vue';
import type { QueryObserverResult } from '@tanstack/vue-query'

const authStore = useAuthStore()

const audio_id: Ref<string | null> = ref(null);
const audio_url: Ref<string | null> = ref(null);
const text_to_convert = ref('');
const selected_audio_file_name = ref('')
// TODO: audios convertidos pensnado en que sean mas de uno...
const convertedAudios = ref<Tts_Convert_with_name[]>([]);
// Variables audio Name edit
const editingIndex = ref<number | null>(null); // indice del audio en edición
const audioNameTemp = ref("");  // temporal para el nombre del audio
let originalExtension = ""; // para almacenar la extension original del archivo

const { mutate: createTextToSpeech, isPending: isConverting } = useConvertTextToSpeech()
const { mutate: saveAudio, isPending: isPendingSave } = useSaveAudio()
const { refetch: download_audio } = useDownloadAudio(selected_audio_file_name)

/* ----- Audio Player ----- */
const handle_play_audio = (audio: Tts_Convert_with_name) => {
    if(!audio) return
    const user_id = authStore.user?.id ?? 1

    const audio_to_play: Audio = {
        id: Math.floor(Math.random() * 100000) + 1 + Date.now(),
        user_id: user_id,
        name: audio.name,
        created_at: '',
        last_used: '',
        file_name: audio.file_name,
        length: 0,
        is_delete: 'N',
        full_file_url: audio.full_file_url,
    }

    audio_to_play_hook.value = audio_to_play
}

const { audio_playing, audio_to_play: audio_to_play_hook, handle_player_action, is_audio_loading } = useAudioPlayer(null)
/* ----- Audio Player ----- */

const { show_error_toast } = usePrimeVueToast();
const emit = defineEmits(['close', 'success', 'error'])

const reset_all = () => {
    text_to_convert.value = "";
    audio_id.value = null;
    audio_url.value = null;
    convertedAudios.value = [];
    editingIndex.value = null;
    audioNameTemp.value = "";
};

const disabled_save_btn = computed(() => !convertedAudios.value.length || isPendingSave.value || isConverting.value)

const convert_Text = async () => {
    audio_id.value = null
    audio_url.value = null

    if (!(text_to_convert.value.trim())) {
        show_error_toast('Error', "The text cannot be empty.")
        return;
    }
    const dataToSend = {
        text: text_to_convert.value.trim(),
        temp: false
    }

    createTextToSpeech(dataToSend, {
        onSuccess: (data: Tts_Convert) => {
            audio_id.value = PREVIEW_TTS;
            audio_url.value = data.full_file_url;
            text_to_convert.value = "";

            // Agrego el nuevo audio al array
            convertedAudios.value.push({
                full_file_url: data.full_file_url,
                file_name: data.file_name,
                name: data.file_name
            });
        }
    });
}

// Función para iniciar edición
const startEditing = (index: number, currentName: string) => {
    editingIndex.value = index;

    // Dividir el nombre y la extensión
    const splitName = currentName.split(".");
    if (splitName.length > 1) {
        originalExtension = splitName.pop()!; // Almacena la extensión
    } else {
        originalExtension = ""; // Sin extensión
    }

    audioNameTemp.value = splitName.join("."); // Almacena solo el nombre sin la extensión
}

const handle_delete = (fileName: string) => convertedAudios.value = convertedAudios.value.filter((audio: Tts_Convert) => audio.file_name !== fileName);

// Función para guardar el nombre editado
const saveAudioName = (index: number) => {
    if (!audioNameTemp.value.trim()) {
        show_error_toast('Error', "The name cannot be empty.")
        return;
    }

    if (convertedAudios.value[index]) {     
        convertedAudios.value[index].name = `${audioNameTemp.value.trim()}.${originalExtension}`;
    }
    
    editingIndex.value = null;
    audioNameTemp.value = "";
}

const cancelEditing = () => {
    editingIndex.value = null; // Restablece el índice de edición
    audioNameTemp.value = ''; // Limpia el nombre temporal si es necesario
}

const save_audios = () => {
    if(!convertedAudios.value.length) return
    
    const audios_to_save: AudioInfoToSave[] = convertedAudios.value.map((audio: Tts_Convert_with_name) => {
        return {
            file_name: audio.file_name,
            name: audio.name.split('.')[0],
        }
    })

    const data_to_send: AudioToSave = {
        action: 'create',
        audio_info: audios_to_save
    }

    saveAudio(data_to_send, {
        onSuccess: (response: APIResponseSuccess | APIResponseError) => {
            if(response.result) {
                const message = audios_to_save.length > 1 ? 'Audios saved successfully!' : 'Audio saved successfully!'
                reset_all()
                emit('success', message)
                emit('close')
            } else {
                emit('error', response.error ?? 'Something failed... please try again later.')
            }
        },
        onError: () => emit('error', 'Something failed, please try again.')
    })
}

//Download audio
const handle_download_audio = (audio_name: string) => {
    if(!audio_name) {
        show_error_toast('Error', "Sorry, this audio is not available for download.")
        return;
    }
    
    selected_audio_file_name.value = audio_name
    download_audio()
            .then((result: QueryObserverResult) => {
                if(!result.data) {
                    show_error_toast('Sorry!', 'This audio is not available for download');
                }
            })
            .catch(() => {
                show_error_toast('Sorry!', 'This audio is not available for download');
            });
}
</script>