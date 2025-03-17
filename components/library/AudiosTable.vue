<template>
    <div class="flex flex-col gap-10 mt-8">
        <div class="flex justify-between w-full">
            <IconField>
                <InputIcon>
                    <SearchSVG class="text-grey-secondary" />
                </InputIcon>
                <InputText v-model="search" placeholder="Search by Name or Type" />
            </IconField>

            <Button class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg">
                <SortBySVG class="text-grey-secondary" />
                <span class="font-semibold">Sort by</span>
            </Button>
        </div>

        <section class="flex flex-col">
            <ProgressBar v-if="isLoading || isPendingDelete" mode="indeterminate" style="height: 6px"></ProgressBar>
            <DataTable
                :value="search.length ? filtered_audios : userAudios"
                dataKey="id" 
                class="audios-table"
                v-model:selection="audio_to_play"
                :selectionMode="isAudioLoading ? undefined : 'single'"
                :rowClass="rowClass"
                @update:selection="handle_update_audio_to_play"
            >
                <Column field="position" header="#" class="text-center">
                    <template #body="slotProps">
                        <div class="w-3 mx-auto">
                            <ProgressSpinner 
                                v-if="isAudioLoading && audio_to_play?.id === slotProps.data.id" 
                                class="w-5 h-5" 
                                strokeWidth="8" 
                                fill="transparent" 
                                animationDuration=".5s" 
                                aria-label="Loading audio" 
                            />
                            <PlayFilledSVG v-else-if="!isAudioLoading && audio_to_play?.id === slotProps.data.id" class="play-icon" />
                            <span v-else class="font-bold">{{ slotProps.data.position }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="name" header="Name">
                    <template #body="slotProps">
                        <span class="font-bold" :class="[{ 'text-[#6750A4]': audio_to_play?.id === slotProps.data.id }]">{{ slotProps.data.name }}</span>
                    </template>
                </Column>
                <Column field="created_at" header="Date Created" class="text-center"></Column>
                <Column field="last_used" header="Last Used" class="text-center"></Column>
                <Column field="length" header="Length" class="text-center">
                    <template #body="slotProps">
                        <span :class="[{ 'font-bold': audio_to_play?.id === slotProps.data.id }]">{{ format_seconds(slotProps.data.length) }}</span>
                    </template>
                </Column>
                <Column field="" header="" class="text-center max-w-32">
                    <template #body="slotProps">
                        <div class="flex justify-center w-fit mx-auto gap-2">
                            <IconButton styles="hover:bg-[#c0a8f7]" 
                                @click.prevent="download_audio(slotProps.data.id)"
                            >
                                <template #icon>
                                    <DownloadSVG />
                                </template>
                            </IconButton>

                            <IconButton styles="hover:bg-[#c0a8f7]" 
                                @click.prevent="edit_audio(slotProps.data.id)"
                            >
                                <template #icon>
                                    <EditIconSVG class="w-4 h-4" />
                                </template>
                            </IconButton>

                            <IconButton styles="hover:bg-[#c0a8f7]"
                                @click.prevent="confirm_delete(slotProps.data.id)"
                            >
                                <template #icon>
                                    <TrashSVG class="w-4 h-4" />
                                </template>
                            </IconButton>
                        </div>
                    </template>
                </Column>

                <template #empty>
                    <p v-if="search.length">No matching records found</p>
                    <p v-if="!userAudios.length">{{ isLoading ? 'Loading Audios' : 'You have no audios yet' }}</p>
                </template>
            </DataTable>

            <Button v-if="!props.showOlder"
                type="button" 
                class="mt-4 text-purple-main bg-transparent border-none text-sm font-medium w-fit self-end transition-all hover:bg-[#e6e2e2] hover:shadow-lg"
                label="Show older audios..."
                @click="emit('update:showOlder', true)"
            />
        </section>

        <Dialog v-model:visible="show_edit_audio" modal header="Edit Audio Information" class="pb-6 max-w-96 w-full">
            <form @submit.prevent class="flex flex-col justify-center items-center gap-6 mt-6">
                <div class="flex flex-col w-full">
                    <label for="audio-name" class="text-lg text-black">Audio Name</label>
                    <InputText type="text" id="audio-name" v-model="audio_name" placeholder="Enter Name" />
                </div>

                <Button class="w-full" type="button" @click="update_audio_data">
                    {{ isPendingSave ? 'Saving...' : 'Save' }}
                </Button>
            </form>
        </Dialog>

        <ConfirmationModal ref="confirmationModal" title="Confirmation" @confirm="delete_audio">
            <p class="text-lg font-semibold">Are you sure you want to delete "{{ selected_audio ? selected_audio.name : 'this audio' }}"?</p>
        </ConfirmationModal>

        <Toast />
    </div>
</template>

<script setup lang="ts">
    import type { QueryObserverResult } from '@tanstack/vue-query'

    const props = withDefaults(
        defineProps<{
            userAudios: ProcessedAudio[];
            audioToPlay: Audio | null;
            isAudioLoading: boolean;
            isLoading: boolean;
            showOlder: boolean;
        }>(),
        {
            userAudios: () => [],
            audioToPlay: null,
            isAudioLoading: false,
            isLoading: false
        }
    );

    const emit = defineEmits<{
        (event: 'update:audioToPlay', audio: ProcessedAudio | null): void;
        (event: 'update:showOlder', showOlder: boolean): void;
    }>();

    const toast = useToast();
    const selected_audio_file_name = ref('')
    const audio_to_play = ref<Audio | null>(props.audioToPlay)
    
    const { mutate: saveAudio, isPending: isPendingSave } = useSaveAudio()
    const { mutate: deleteAudio, isPending: isPendingDelete } = useDeleteAudio()
    const { refetch: download_audio_bro } = useDownloadAudio(selected_audio_file_name)

    const selected_audio = ref<Audio | null>(null)
    const show_edit_audio = ref(false)
    const audio_name = ref('')
    const confirmationModal = ref()
    const search = ref('')

    const filtered_audios = computed((): ProcessedAudio[] => {
        return props.userAudios.filter((audio: ProcessedAudio) => {
            return audio.name.toLowerCase().includes(search.value.toLowerCase())
        })
    })

    const show_error_toast = (title: string, error: string) => toast.add({ severity: 'error', summary: title, detail: error, life: 3000 })
    const show_success_toast = (title: string, message: string) => toast.add({ severity: 'success', summary: title, detail: message, life: 3000 })

    watch(() => props.audioToPlay, (newValue: Audio | null) => {
        audio_to_play.value = newValue
    })

    const handle_update_audio_to_play = (audio: ProcessedAudio | null) => {
        emit('update:audioToPlay', audio)
    }

    const confirm_delete = (audio_id: number) => {
        selected_audio.value = props.userAudios.find((audio: Audio) => audio.id === audio_id) ?? null
        if(!selected_audio.value) return
        confirmationModal.value?.open()
    };

    const download_audio = (audio_id: number) => {
        selected_audio.value = props.userAudios.find((audio: Audio) => audio.id === audio_id) ?? null
        
        if(!selected_audio.value) {
            console.error('Audio file not found or invalid URL');
            return
        }
        
        selected_audio_file_name.value = selected_audio.value.file_name
        download_audio_bro()
                .then((result: QueryObserverResult) => {
                    if(!result.data) {
                        show_error_toast('Sorry!', 'This audio is not available for download');
                    }
                })
                .catch(() => {
                    show_error_toast('Sorry!', 'This audio is not available for download');
                });
    }

    const edit_audio = (audio_id: number) => {
        selected_audio.value = props.userAudios.find((audio: Audio) => audio.id === audio_id) ?? null
        if (selected_audio.value) {
            audio_name.value = selected_audio.value.name
            show_edit_audio.value = true
        }
    }

    const update_audio_data = () => {
        if(!selected_audio.value) return
        if(!audio_name.value) {
            show_error_toast('Validation error', 'Please enter a name for the audio')
            return
        }
        
        const data_to_send: AudioToSave = {
            action: 'update',
            audio_info: [{
                audio_id: selected_audio.value.id,
                file_name: selected_audio.value.file_name,
                length: selected_audio.value.length,
                name: audio_name.value
            }]
        }

        saveAudio(data_to_send, {
            onSuccess: (response: { result: true } | APIResponseError) => {
                if(response.result) {
                    show_success_toast('Success', 'Audio information updated!')
                    show_edit_audio.value = false
                    audio_name.value = ''
                    selected_audio.value = null
                } else {
                    show_error_toast('Oops...', response.error ?? 'Something failed!')
                }
            },
            onError: () => show_error_toast('Oops...', 'Something failed!')
        })
    }

    const delete_audio = () => {
        if(!selected_audio.value) return

        const data_to_send: AudioToDelete = {
            audio_id: selected_audio.value.id,
        }

        deleteAudio(data_to_send, {
            onSuccess: (response: { result: true } | APIResponseError) => {
                if(response.result) {
                    show_success_toast('Success', 'Audio deleted!')
                    selected_audio.value = null
                } else {
                    show_error_toast('Oops...', response.error ?? 'Something failed!')
                }
            },
            onError: () => {
                show_error_toast('Oops...', 'Something failed!')
            }
        })
    }

    const rowClass = (data: any) => {
        return [{ '!bg-[#D0BCFF]': audio_to_play && audio_to_play.value?.id === data.id }];
    };
</script>

<style scoped lang="scss">
::v-deep(.audios-table) {
    min-width: 40rem;

    .p-datatable-thead, .p-datatable-header-cell {
        background-color: rgb(233, 231, 235);
        &:first-child {
            border-top-left-radius: 6px;
        }
        &:last-child {
            border-top-right-radius: 6px;
        }

        tr {
            th:not(:nth-child(2)) {
                .p-datatable-column-header-content {
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }

    td {
        height: 65px;
    }

    .p-datatable-tbody {
        :nth-last-child(1) {
            td {
                border-bottom: none;
            }
        }
    }

    tr {
        &:hover {
            background-color: #EBDDFF;
        }
    }
}

.play-icon {
    stroke: #6750A4;
    fill: #6750A4;
}
</style>