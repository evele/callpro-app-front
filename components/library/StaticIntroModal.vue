<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-5 px-8">
                <h2 class="flex items-center gap-4 font-bold text-2xl text-black">Select Static Intro</h2>
                <Button @click="handle_close_modal" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <div class="flex justify-between w-full mb-10">
            <IconField>
                <InputIcon>
                    <SearchSVG class="text-[#757575]" />
                </InputIcon>
                <InputText v-model="search" placeholder="Search by Name" class="max-w-56" />
            </IconField>

            <div class="flex items-center gap-4">
                <Button 
                    @click="handle_open_submodal('upload')"
                    class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg"
                >
                    <UploadAudioSVG class="text-[#757575] w-5 h-5" />
                    <span class="font-semibold text-sm">Upload audio file</span>
                </Button>

                <Button
                    @click="handle_open_submodal('tts')"
                    class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg"
                >
                    <TextSVG class="text-[#757575] w-5 h-5" />
                    <span class="font-semibold text-sm">Add new TTS</span>
                </Button>
            </div>
        </div>

        <ProgressBar :class="[isFetching || isPendingSave ? 'opacity-1' : 'opacity-0']" mode="indeterminate" style="height: 6px"></ProgressBar>
        <div v-if="user_audios" class="w-full max-h-[320px] overflow-y-auto rounded-tl-xl rounded-tr-xl">
            <table class="w-full text-gray-700 border border-gray-200 border-collapse">
                <thead class="sticky -top-[1px] z-[100] bg-[#e9e9e9]">
                    <tr class="bg-[#e9e9e9] h-[38px] text-[#1D1B20] font-medium border-b border-gray-300">
                        <th class="px-8 w-20"></th>
                        <th class="px-4 text-left text-sm font-medium">Name</th>
                        <th class="px-4 text-center text-sm font-medium">Play</th>
                        <th class="px-4 text-center text-sm font-medium">Edit</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-if="user_audios.length"
                        v-for="audio in user_audios"
                        :key="audio.id"
                        class="pt-4 pb-[15px] h-[70px] odd:bg-[#f4f4f4] even:bg-white"
                        :class="{ '!bg-[#ebddff]': selected_audio_id === audio.id }"
                    >
                        <td class="text-center">
                            <RadioButton v-model="selected_audio_id" :inputId="'audio-' + audio.id" :name="'audio-' + audio.name" :value="audio.id" />
                        </td>

                        <td>{{ audio.name }}</td>

                        <td class="text-center">
                            <Button class="bg-primary p-0 hover:scale-110 transition-transform" @click="handle_play_audio(audio)">
                                <PlaySVG class="w-7 h-7 text-white" />
                            </Button>
                        </td>

                        <td class="text-center">
                            <Button
                                @click="handle_open_edit_audio_modal(audio)"
                                class="w-7 h-7 bg-[#e7e0ec] rounded-full text-[#1D1B20] border-none hover:scale-110 transition-transform"
                            >
                                <template #icon>
                                    <EditIconSVG class="w-4 h-4 relative bg-[#e7e0ec] rounded-[10px]" />
                                </template>
                            </Button>
                        </td>
                    </tr>
                    <tr v-else>
                        <td class="text-center" colspan="4">{{ isFetching ? 'Loading data...' : 'No audios found' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <template #footer>
            <footer class="flex justify-center w-full font-bold mt-[38px]">
                <Button @click="handle_save" class="w-[300px]" :disabled="!selected_audio_id">
                    Save
                </Button>
            </footer>
        </template>
    </Dialog>

    <ConfirmationModal 
        ref="confirmationModal" 
        title="Edit Audio Name" 
        :is-disabled="disabled_edit_audio_btn" 
        @confirm="handle_edit_audio" 
        @cancel="handle_close_edit_audio_modal"
    >
        <div class="flex flex-col w-full gap-1">
            <label for="audio-name" class="text-lg text-black">Audio Name</label>
            <InputText type="text" id="audio-name" v-model="audio_name" placeholder="Enter Name" />
        </div>
    </ConfirmationModal>

    <AudioPlayer v-if="visible" :current-audio="audio_playing" @action="handle_player_action" :from-modal="true" />

    <StaticIntroSubModal ref="staticIntroSubModal" :section-to-show="submodal_section_to_show" @update:audios="refetch" />
</template>

<script setup lang="ts">
    import PlaySVG from '../svgs/PlaySVG.vue'
    import EditIconSVG from '../svgs/EditIconSVG.vue'
    import UploadAudioSVG from '../svgs/UploadAudioSVG.vue'

    const visible = ref(false)
    const show_older = ref(true)

    const { data: allAudiosData, isFetching, isSuccess, refetch } = useFetchGetAllAudios(show_older, false)
    const { mutate: saveAudio, isPending: isPendingSave } = useSaveAudio()

    const emit = defineEmits(['update:selected-audio'])

    const user_audios = computed((): Audio[] => {
        if(allAudiosData.value && allAudiosData.value.result) {
            if(search.value) {
                return [...allAudiosData.value.audios].filter((audio: Audio) => audio.name.toLowerCase().includes(search.value.toLowerCase())).reverse()
            }
            return [...allAudiosData.value.audios].reverse()
        }
        return []
    })

    const handle_play_audio = (audio: Audio) => {
        console.log(audio)
        if(!audio) return
        audio_playing.value = audio
    }

    /* ----- Audio Player ----- */
    const { audio_playing, handle_player_action } = useAudioPlayer(user_audios)
    /* ----- Audio Player ----- */

    const selected_audio_id = ref<number | null>(null)
    const selected_audio_to_edit = ref<Audio | null>(null)
    const search = ref('')
    const confirmationModal = ref()
    const audio_name = ref('')

    const open = (audio_id: number | undefined) => {
        if(audio_id) {
            selected_audio_id.value = audio_id
        }
        refetch()
        visible.value = true;
    }

    const close = () => {
        selected_audio_id.value = null
        selected_audio_to_edit.value = null
        audio_name.value = ''
        search.value = ''
        audio_playing.value = null
        visible.value = false;
    }

    const handle_close_modal = () => {
        close()
    }

    const handle_save = () => {
        if(!selected_audio_id.value) {
            show_error_toast('Validation error', 'Please select an audio to save')
            return
        }

        const selected_audio = user_audios.value.find((audio: Audio) => audio.id === selected_audio_id.value)
        emit('update:selected-audio', selected_audio)
        close()
    }

    defineExpose({ open })

    const { show_error_toast, show_success_toast } = usePrimeVueToast();

    const disabled_edit_audio_btn = computed(() => audio_name.value === '')

    const handle_open_edit_audio_modal = (audio: Audio) => {
        if(audio.id) {
            selected_audio_to_edit.value = audio
            audio_name.value = audio.name
            confirmationModal.value.open()
        }
    }

    const handle_close_edit_audio_modal = () => {
        selected_audio_to_edit.value = null
        audio_name.value = ''
    }

    const handle_edit_audio = () => {
        if(audio_name.value === '') {
            show_error_toast('Validation error', 'Audio name cannot be empty')
            return
        }
        if(!selected_audio_to_edit.value) {
            show_error_toast('Error', 'Something went wrong, please try again!')
            return
        }
        
        const data_to_send: AudioToSave = {
            action: 'update',
            audio_info: [{
                audio_id: selected_audio_to_edit.value.id,
                file_name: selected_audio_to_edit.value.file_name,
                length: selected_audio_to_edit.value.length,
                name: audio_name.value
            }]
        }

        saveAudio(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_success_toast('Success', 'Audio information updated!')
                } else {
                    show_error_toast('Oops...', response.error ?? 'Something went wrong, please try again!')
                }
                refetch()
            },
            onError: () => show_error_toast('Oops...', 'Something went wrong, please try again!')
        })
        selected_audio_to_edit.value = null
        audio_name.value = ''
    }

    /* ----- Submodal ----- */
    const submodal_section_to_show = ref<'upload' | 'tts' | ''>('')
    const staticIntroSubModal = ref()
    
    const handle_open_submodal = (section: 'upload' | 'tts') => {
        if(!section) return

        submodal_section_to_show.value = section
        audio_playing.value = null
        staticIntroSubModal?.value?.open_modal()
    }
</script>