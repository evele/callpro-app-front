<template>
    <Dialog v-model:visible="visible" modal header="Add Audio from TTS"
        class="flex-col text-2xl w-full max-w-[850px] gap-[38px]">
        <!--  -->
        <div class="flex flex-col  gap-[38px]">            
            <div
                class="w-[786px] h-[49px] pl-2.5 py-2 bg-[#4f378b]/20 rounded-tl-[10px] rounded-tr-[10px] border-b border-[#9747ff] justify-start items-center inline-flex">
                <div class="w-[738px] h-[33px] text-[#1e1e1e] text-sm font-normal font-['Inter'] leading-snug">Type
                    the message here to have it converted to audio.</div>
            </div>
            <textarea v-model="text_to_convert" placeholder="Enter text"
                class="h-[97.75px] px-4 py-3 bg-white rounded-[9.68px] border border-[#d9d9d9] w-full text-[#1e1e1e] text-base font-normal leading-snug">
                </textarea>
            <!-- area preview aduio conver -->
            <div class="justify-start items-center inline-flex">
                <div
                    class="w-[170px] self-stretch px-[39.28px] py-[9.43px] bg-[#322f35] rounded-xl shadow justify-center items-center gap-[6.98px] inline-flex">
                    <button type="button" @click="convert_Text"
                        class="text-center text-white text-sm font-medium font-['Roboto'] leading-tight"
                        :disabled="isConverting">
                        {{ isConverting ? 'Converting...' : 'Convert' }}
                    </button>
                    <!-- <div class="text-center text-white text-sm font-medium font-['Roboto'] leading-tight">Convert</div> -->
                </div>
            </div>
            <ul v-if="isSuccess && convertedAudios.length" class="ml-2 is-flex is-flex-direction-column is-gap-1">
                
                <li v-for="(audio, index) in convertedAudios" :key="index" class="is-flex is-gap-2">        
                    <!-- area preview aduio conver -->
                    <div class="w-[786px] h-[47px] px-2.5 py-[5px] rounded-tl-[10px] rounded-tr-[10px] justify-start items-center gap-[30px] inline-flex">
                        <div class="text-[#65558f] text-base font-normal font-['Inter'] underline">
                            <span class="mt-3 has-text-weight-semibold has-text-primary is-size-5">{{ audio.file_name
                                }}</span>
                        </div>
                        <!-- button action -->
                        <div class="w-[138px] h-[37px] py-px justify-center items-center gap-3.5 flex">
                            <!-- play -->
                            <div class="w-6 h-6  bg-[#653494] rounded-[10px] justify-center items-center flex">
                                <PlaySVG class="w-6 h-6 bg-[#653494] text-white rounded-[10px]" />
                            </div>
                            <!-- download -->
                            <div class="w-6 h-6 p-1.5 bg-[#e7e0ec] rounded-[10px] justify-center items-center flex">
                                <DownloadSVG class="w-6 h-6 relative bg-[#e7e0ec] rounded-[10px]" />
                            </div>
                            <!-- edit -->
                            <div class="w-6 h-6 p-1.5 bg-[#e7e0ec] rounded-[10px] justify-center items-center flex">
                                <EditIconSVG class="w-6 h-6 relative bg-[#e7e0ec] rounded-[10px]" />
                            </div>
                            <!-- trash -->
                            <div class="w-6 h-6 p-1.5 bg-[#e7e0ec] rounded-[10px] justify-center items-center flex">
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

const { data: allAudiosData, isLoading: loadingAllAudios, isSuccess, refetch } = useFetchGetAllAudios(show_older)
const { mutate: createTextToSpeech, isPending: isConverting } = useConvertTextToSpeech()
const { data: audioData, refetch: refetchAudioData } = useFetchGetAudio(audio_id, audio_url, CALLPRO_APP_FRONT)

// const emit = defineEmits(['update:convert_text']);


const close = () => {
    visible.value = false;
    text_to_convert.value = "";
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

    // createTextToSpeech(dataToSend, {
    //     onSuccess: (data: Tts_Convert) => {
    //         console.log("paso intermedio")
    //         audio_id.value = PREVIEW_TTS
    //         audio_url.value = data.full_file_url
    //     }
    // })

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

    // isPending.value = true;
    // emit('update:convert_text', dataToSend);
    // setTimeout(() => {
    //     isPending.value = false;
    //     close();
    // }, 2000);
}
const open = () => {
    visible.value = true;
    console.log("open")
}
defineExpose({ open });

</script>