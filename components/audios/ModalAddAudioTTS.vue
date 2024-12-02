<template>
    <Dialog v-model:visible="visible" modal header="Add Audio from TTS" @hide="close"
        class="text-2xl w-full max-w-[850px] gap-[38px]">
        <!--  -->
        <div class="flex flex-col  gap-[38px]">
            <div
                class="pl-2.5 py-2 bg-[#4f378b]/20 rounded-tl-[10px] rounded-tr-[10px] border-b border-[#9747ff] justify-start items-center inline-flex">
                <div class="text-[#1e1e1e] text-sm font-normal font-['Inter']">Type
                    the message here to have it converted to audio.</div>
            </div>
            <textarea v-model="text_to_convert" placeholder="Enter text"
                class="h-24 px-4 py-3 bg-white rounded-[10px] border border-[#d9d9d9] text-[#1e1e1e] text-base font-normal">
                </textarea>
            <!-- area preview aduio conver -->
            <div class="justify-start items-center inline-flex">
                <div
                    class="w-[170px] self-stretch px-10 py-[9px] bg-[#322f35] rounded-xl shadow justify-center items-center gap-2 inline-flex">
                    <button type="button" @click="convert_Text"
                        class="text-center text-white text-sm font-medium"
                        :disabled="isConverting">
                        {{ isConverting ? 'Converting...' : 'Convert' }}
                    </button>
                    
                </div>
            </div>
            <ul v-if="isSuccess && convertedAudios.length" class="ml-2 is-flex is-flex-direction-column is-gap-1">

                <li v-for="(audio, index) in convertedAudios" :key="index" class="is-flex is-gap-2">
                    <!-- area preview aduio conver -->
                    <div
                        class="px-2.5 py-[5px] justify-start items-center gap-[30px] inline-flex">
                        <!-- Condicional para mostrar el nombre o el input -->
                        <div v-if="editingIndex === index"
                            class="w-[371px] flex flex-col  justify-start items-start gap-2">
                            <div class="self-stretch text-[#1e1e1e] text-base font-normal font-['Inter']">Audio Name
                            </div>
                            <!-- input and close -->
                            <div class="flex flex-row items-center gap-[29px]">
                                <!-- Input editable para cambiar el nombre -->
                                <div
                                    class="w-[371px] px-4 py-3 bg-white rounded-[30px] border border-[#d9d9d9] justify-start items-center inline-flex">
                                    <input v-model="audioNameTemp" @blur="saveAudioName(index)"
                                        @keyup.enter="saveAudioName(index)"
                                        class="grow shrink basis-0 text-[#1e1e1e] text-base font-normal font-['Inter'] underline bg-transparent" />
                                </div>
                                <!-- Botón CloseSVG para cancelar la edición -->
                                <div @click="cancelEditing()"
                                    class="w-6 h-6 p-1 bg-[#e7e0ec] rounded-[10px] flex justify-center items-center cursor-pointer">
                                    <CloseSVG class="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <!-- Mostrar el nombre si no está en modo de edición -->
                        <div v-else @click="startEditing(index, audio.file_name)"
                            class="text-[#65558f] text-base font-normal font-['Inter'] underline cursor-pointer">
                            {{ audio.file_name }}
                        </div>

                        <!-- Bloque de botones (Play, Download, Edit, Trash) si no está en modo de edición -->
                        <div v-if="editingIndex !== index"
                            class="w-[138px] py-px justify-center items-center gap-3.5 flex">
                            <!-- play -->
                            <div class="w-6 h-6  bg-[#653494] rounded-[10px] justify-center items-center flex">
                                <PlaySVG class="w-6 h-6 bg-[#653494] text-white rounded-[10px]" />
                            </div>
                            <!-- download -->
                            <div class="w-6 h-6 bg-[#e7e0ec] rounded-[10px] justify-center items-center flex">
                                <DownloadSVG class="w-6 h-6 relative bg-[#e7e0ec] rounded-[10px]" />
                            </div>
                            <!-- edit -->
                            <div @click="startEditing(index, audio.file_name)"
                                class="w-6 h-6 p-1 bg-[#e7e0ec] rounded-[10px] justify-center items-center flex">
                                <EditIconSVG class="w-6 h-6 relative bg-[#e7e0ec] rounded-[10px]" />
                            </div>
                            <!-- trash -->
                            <div class="w-6 h-6  bg-[#e7e0ec] rounded-[10px] justify-center items-center flex">
                                <TrashSVG class="w-6 h-6 relative bg-[#e7e0ec] rounded-[10px] " />
                            </div>
                        </div><!-- button action -->

                    </div>
                </li>
            </ul>

        </div>
        <!--  -->
        <template #footer>
            <Button type="button" class="justify-center items-center w-[300px] mx-auto" :disabled="isPending">
                {{ isPending ? 'Saving...' : 'Save' }}
            </Button>
        </template>
    </Dialog>
</template>

<script setup lang="ts">

import CloseSVG from '../svgs/CloseSVG.vue';
import DownloadSVG from '../svgs/DownloadSVG.vue';
import EditIconSVG from '../svgs/EditIconSVG.vue';
import PlaySVG from '../svgs/PlaySVG.vue';
import TrashSVG from '../svgs/TrashSVG.vue';

const audio_id: Ref<string | null> = ref(null);
const audio_url: Ref<string | null> = ref(null);
const visible = ref(false);
const text_to_convert = ref('');
const isLoading = ref(false)
const isPending = ref(false);
const show_older = ref(false)
// TODO: audios convertidos pensnado en que sean mas de uno...
const convertedAudios = ref<Tts_Convert[]>([]);

// Variables audio Name edit
interface AudioFile {
    file_name: string;
}
const editingIndex = ref<number | null>(null); // indice del audio en edición
const audioNameTemp = ref("");  // temporal para el nombre del audio
let originalExtension = ""; // para almacenar la extension original del archivo


const { data: allAudiosData, isLoading: loadingAllAudios, isSuccess, refetch } = useFetchGetAllAudios(show_older)
const { mutate: createTextToSpeech, isPending: isConverting } = useConvertTextToSpeech()
const { data: audioData, refetch: refetchAudioData } = useFetchGetAudio(audio_id, audio_url, CALLPRO_APP_FRONT)


const close = () => {
    visible.value = false;
    text_to_convert.value = "";
    audio_id.value = null;
    audio_url.value = null;
    convertedAudios.value = [];
    editingIndex.value = null;
    audioNameTemp.value = "";
};


const convert_Text = async () => {
    audio_id.value = null
    audio_url.value = null

    if (!(text_to_convert.value.trim())) {
        alert('No se puede convertir texto vacío');
        return;
    }
    const dataToSend = {
        text: text_to_convert.value.trim(),
        temp: false
    }

    createTextToSpeech(dataToSend, {
        onSuccess: (data: Tts_Convert) => {
            console.log("paso intermedio");
            audio_id.value = PREVIEW_TTS;
            audio_url.value = data.full_file_url;

            // Agrego el nuevo audio al array
            convertedAudios.value.push({
                full_file_url: data.full_file_url,
                file_name: data.file_name,
            });
        }
    });
    console.log("--->", convertedAudios)
}

// Función para iniciar edición
const startEditing = (index: number, currentName: string) => {
    editingIndex.value = index;
    audioNameTemp.value = currentName;

    // almacenamos la extensión del nombre original
    const splitName = currentName.split(".");
    originalExtension = splitName.length > 1 ? splitName.pop()! : ""; 
}

// Función para guardar el nombre editado
const saveAudioName = (index: number) => {
    if (!audioNameTemp.value.trim()) {
        alert("The name cannot be empty.");
        return;
    }

    const splitEditedName = audioNameTemp.value.split(".");
    const editedExtension = splitEditedName.length > 1 ? splitEditedName.pop()! : "";

    if (editedExtension !== originalExtension) {
        alert(`The file extension must be .${originalExtension}`);
        return;
    }


    if (convertedAudios.value[index]) {
        convertedAudios.value[index].file_name = audioNameTemp.value;
    }
    editingIndex.value = null;
}

const cancelEditing = () => {
    editingIndex.value = null; // Restablece el índice de edición
    audioNameTemp.value = ''; // Limpia el nombre temporal si es necesario
}

const open = () => {
    visible.value = true;
    console.log("open")
}
defineExpose({ open });

</script>