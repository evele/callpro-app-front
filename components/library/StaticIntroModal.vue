<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-5 px-8">
                <h2 class="flex items-center gap-4 font-bold text-2xl text-black">Select Static Intro</h2>
                <Button @click="handle_close_modal" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <div class="flex justify-between w-full mb-6">
            <IconField>
                <InputIcon>
                    <SearchSVG class="text-grey-secondary" />
                </InputIcon>
                <InputText v-model="search" placeholder="Search by Name" class="max-w-56" />
            </IconField>

            <div class="flex items-center gap-4">
                <Button 
                    @click="handle_open_submodal('upload')"
                    class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg"
                >
                    <UploadAudioSVG class="text-grey-secondary w-5 h-5" />
                    <span class="font-semibold text-sm">Upload audio file</span>
                </Button>

                <Button
                    @click="handle_open_submodal('tts')"
                    class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg"
                >
                    <TextSVG class="text-grey-secondary w-5 h-5" />
                    <span class="font-semibold text-sm">Add new TTS</span>
                </Button>
            </div>
        </div>

        <ProgressBar :class="[isFetching || isPendingSave ? 'opacity-1' : 'opacity-0']" mode="indeterminate" style="height: 6px;"></ProgressBar>
        <DataTable 
            :value="user_audios"
            v-model:selection="selected_audio"
            scrollable 
            class="static-intro-table m-auto w-full min-h-[450px] h-full" 
            paginator
            :rows="5"
            dataKey="id"
            :rowClass="rowClass"
            selectionMode="single"
        >
            <Column headerStyle="width: 3rem">
                <template #body="slotProps">
                    <RadioButton v-model="selected_audio" :inputId="'audio-' + slotProps.data.id" :name="'audio-' + slotProps.data.name" :value="slotProps.data" />                                
                </template>
            </Column>

            <Column field="name" header="Name" class="text-left">
                <template #body="slotProps">
                    <div class="text-[#1D1B20] relative w-fit">
                        <span>{{ slotProps.data.name }}</span>
                    </div>
                </template>
            </Column>

            <Column field="play" header="Play" class="text-left">
                <template #body="slotProps">
                    <div class="text-[#1D1B20] relative w-fit">
                        <ProgressSpinner 
                            v-if="is_audio_loading && audio_to_play?.id === slotProps.data.id" 
                            class="w-5 h-5" 
                            strokeWidth="8" 
                            fill="transparent" 
                            animationDuration=".5s" 
                            aria-label="Loading audio" 
                        />
                        <IconButton 
                            v-else
                            type="button"
                            bg-color="bg-primary" 
                            @click.stop="handle_play_audio(slotProps.data)"
                            :disabled="is_audio_loading"
                        >
                            <template #icon>
                                <PlaySVG class="w-4 h-4 text-white" />
                            </template>
                        </IconButton>
                    </div>
                </template>
            </Column>

            <Column field="play" header="Play" class="text-left">
                <template #body="slotProps">
                    <div class="text-[#1D1B20] relative w-fit">
                        <IconButton @click.stop="handle_open_edit_audio_modal(slotProps.data)">
                            <template #icon>
                                <EditIconSVG class="w-4 h-4" />
                            </template>
                        </IconButton>
                    </div>
                </template>
            </Column>

            <template #empty>
                <tr v-if="isFetching">
                    <td>
                        Loading data...
                    </td>
                </tr>
                <tr v-else>
                    <td>
                        No audios found
                    </td>
                </tr>
            </template>

            <template #paginatorstart>
                <div></div>
            </template>
        </DataTable>

        <template #footer>
            <footer class="flex justify-center w-full font-bold mt-[38px]">
                <Button @click="handle_save" class="w-[300px]" :disabled="!selected_audio?.id">
                    Ok
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

    <StaticIntroSubModal ref="staticIntroSubModal" :section-to-show="submodal_section_to_show" @update:audios="refetch" />
</template>

<script setup lang="ts">
    import PlaySVG from '../svgs/PlaySVG.vue'
    import EditIconSVG from '../svgs/EditIconSVG.vue'
    import UploadAudioSVG from '../svgs/UploadAudioSVG.vue'

    const audiosStore = useAudiosStore();
    const visible = ref(false)
    const show_older = ref(true)

    const { data: allAudiosData, isFetching, refetch } = useFetchGetAllAudios(show_older, false)
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
        if(!audio) return
        audio_to_play.value = audio
    }

    /* ----- Audio Player ----- */
    const { audio_to_play, is_audio_loading } = useAudioPlayer(user_audios, true)
    /* ----- Audio Player ----- */

    const selected_audio = ref<Audio | null>(null)
    const selected_audio_to_edit = ref<Audio | null>(null)
    const search = ref('')
    const confirmationModal = ref()
    const audio_name = ref('')

    const open = (audio: Audio) => {
        if(audio) {
            selected_audio.value = audio
        }
        refetch()
        visible.value = true;
    }

    const close = () => {
        selected_audio.value = null
        selected_audio_to_edit.value = null
        audio_name.value = ''
        search.value = ''
        audiosStore.audio_playing = null
        visible.value = false;
    }

    const handle_close_modal = () => {
        close()
    }

    const handle_save = () => {
        if(!selected_audio.value?.id) {
            show_error_toast('Validation error', 'Please select an audio to save')
            return
        }
        emit('update:selected-audio', selected_audio.value)
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
        audiosStore.audio_playing = null
        staticIntroSubModal?.value?.open_modal()
    }

    const rowClass = (audio: Audio) => {
        return [{ '!bg-[#E9DDFF]': selected_audio?.value?.id === audio.id }];
    };
</script>

<style lang="scss">
.static-intro-table {
    .p-datatable-table {
        border-collapse: collapse;
        width: 100%;
        position: relative;
    }

    .p-datatable-thead, .p-datatable-header-cell {
        background-color: #e9e9e9;
        line-height: 28px;
 
        &:first-child {
            border-top-left-radius: 6px;
        }
        &:last-child {
            border-top-right-radius: 6px;
        }

        th {
            padding-top: 5px;
            padding-bottom: 5px;
        }
    }

    .p-datatable-tbody {

        tr {
            &:nth-child(even) {
                background-color: rgba(121, 116, 126, 0.08);
            }

            height: 70px!important;
            
            &:hover {
                cursor: pointer;
                background-color: #efe9f7;
            }
            td {
                height: 70px!important;
            }
        }
    }

    .p-datatable-paginator-bottom {
        border: none;
        position: absolute;
        bottom: 0px;
        width: 100%;

        .p-paginator-first, .p-paginator-prev, .p-paginator-page, .p-paginator-next, .p-paginator-last {
            background-color: transparent;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            transition: background-color 0.3s;
            height: 24px;
            width: 24px;
            min-width: 24px;

            &:hover {
                background-color: #e6e2e2;
            }
        }

        .p-paginator-page-selected {
            background-color: #2C2C2C;
            color: white;
            
            &:hover {
                background-color: #2C2C2C;
            }
        }
    }
}
</style>