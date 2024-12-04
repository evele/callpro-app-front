<template>
    <div class="flex flex-col gap-10 mt-8">
        <div class="flex justify-between w-full">
            <IconField>
                <InputIcon>
                    <SearchSVG class="text-[#757575]" />
                </InputIcon>
                <InputText v-model="search" placeholder="Search by Name or Type" />
            </IconField>

            <Button class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg">
                <SortBySVG class="text-[#757575]" />
                <span class="font-semibold">Sort by</span>
            </Button>
        </div>

        <section>
            <ProgressBar v-if="isFetching" mode="indeterminate" style="height: 6px"></ProgressBar>
            <DataTable
                :value="search.length ? filtered_audios : user_audios"
                dataKey="id" 
                class="audios-table"
                v-model:selection="audio_playing"
                selectionMode="single"
                :rowClass="rowClass"
            >
                <Column field="position" header="#" class="text-center">
                    <template #body="slotProps">
                        <div class="w-3 mx-auto">
                            <PlayFilledSVG v-if="audio_playing?.id === slotProps.data.id" class="play-icon" />
                            <span v-else class="font-bold">{{ slotProps.data.position }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="name" header="Name">
                    <template #body="slotProps">
                        <span class="font-bold" :class="[{ 'text-[#6750A4]': audio_playing?.id === slotProps.data.id }]">{{ slotProps.data.name }}</span>
                    </template>
                </Column>
                <Column field="created_at" header="Date Created" class="text-center"></Column>
                <Column field="last_used" header="Last Used" class="text-center"></Column>
                <Column field="length" header="Length" class="text-center">
                    <template #body="slotProps">
                        <span :class="[{ 'font-bold': audio_playing?.id === slotProps.data.id }]">{{ format_seconds(slotProps.data.length) }}</span>
                    </template>
                </Column>
                <Column field="" header="" class="text-center max-w-32">
                    <template #body="slotProps">
                        <div class="flex justify-center w-fit mx-auto gap-2">
                            <Button class="bg-[#E7E0EC] p-1 text-[#1E1E1E] border-none hover:bg-[#c0a8f7]" @click.prevent="download_audio(slotProps.data.id)">
                                <DownloadSVG />
                            </Button>
                            <Button class="bg-[#E7E0EC] py-1 px-2 text-[#1E1E1E] border-none hover:bg-[#c0a8f7]" @click.prevent="edit_audio(slotProps.data.id)">
                                <EditIconSVG />
                            </Button>
                            <Button class="bg-[#E7E0EC] p-1 text-[#1E1E1E] border-none hover:bg-[#c0a8f7]" @click.prevent="delete_modal(slotProps.data.id)">
                                <TrashSVG />
                            </Button>
                        </div>
                    </template>
                </Column>

                <template #empty>
                    <p v-if="search.length">No matching records found</p>
                    <p v-if="!user_audios.length">{{ isFetching ? 'Loading Audios' : 'You have no audios yet' }}</p>
                </template>
            </DataTable>
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

        <ConfirmDialog :visible="show_confirm" class="confirm-dialog">
            <template #message>
                <div class="flex flex-col mt-4 mb-6 gap-2">
                    <p class="text-lg font-semibold">Are you sure you want to delete "{{ selected_audio ? selected_audio.name : 'this audio' }}"?</p>
                    <ProgressBar v-if="isPendingDelete" mode="indeterminate" style="height: 5px"></ProgressBar>
                </div>
            </template>
        </ConfirmDialog>

        <Toast />
    </div>
    <AudioPlayer :current-audio="audio_playing" @action="handle_player_action" />
</template>

<script setup lang="ts">
    import type { QueryObserverResult } from '@tanstack/vue-query'

    const confirm = useConfirm();
    const toast = useToast();
    const show_older = ref(false)
    const selected_audio_file_name = ref('')

    const { data: allAudiosData, isFetching, isSuccess } = useFetchGetAllAudios(show_older)
    const { mutate: saveAudio, isPending: isPendingSave } = useSaveAudio()
    const { mutate: deleteAudio, isPending: isPendingDelete } = useDeleteAudio()
    const { refetch: download_audio_bro } = useDownloadAudio(selected_audio_file_name)

    const audio_playing = ref<Audio | null>(null)
    const selected_audio = ref<Audio | null>(null)
    const show_edit_audio = ref(false)
    const audio_name = ref('')
    const show_confirm = ref(false)
    const search = ref('')

    type ProcessedAudio = Audio & {
        position: number;
        created_at: string;
        last_used: string;
    };

    const user_audios = computed((): ProcessedAudio[] => {
        if(allAudiosData.value && allAudiosData.value.result) {
            return allAudiosData.value.audios.map((audio: Audio, index: number) => {
                return {
                    ...audio,
                    position: index + 1,
                    created_at: new Date(audio.created_at).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    }),
                    last_used: new Date(audio.last_used).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })
                }
            })
        }
        return []
    })

    const filtered_audios = computed((): ProcessedAudio[] => {
        return user_audios.value.filter((audio: ProcessedAudio) => {
            return audio.name.toLowerCase().includes(search.value.toLowerCase())
        })
    })

    const show_error_toast = (title: string, error: string) => toast.add({ severity: 'error', summary: title, detail: error, life: 3000 })
    const show_success_toast = (title: string, message: string) => toast.add({ severity: 'success', summary: title, detail: message, life: 3000 })

    const delete_modal = (audio_id: number) => {
        selected_audio.value = user_audios.value.find((audio: Audio) => audio.id === audio_id) ?? null
        if(!selected_audio.value) return
        show_confirm.value = true
        confirm.require({
            header: 'Confirmation',
            rejectProps: {
                label: 'No',
                severity: 'secondary'
            },
            acceptProps: {
                label: 'Yes',
            },
            accept: () => {
                delete_audio()
            },
            reject: () => {
                show_confirm.value = false
            }
        });
    };

    const download_audio = (audio_id: number) => {
        selected_audio.value = user_audios.value.find((audio: Audio) => audio.id === audio_id) ?? null
        
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
        selected_audio.value = user_audios.value.find((audio: Audio) => audio.id === audio_id) ?? null
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
            audio_info: {
                audio_id: selected_audio.value.id,
                file_name: selected_audio.value.file_name,
                length: selected_audio.value.length,
                name: audio_name.value
            }
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
                show_confirm.value = false
            },
            onError: () => {
                show_error_toast('Oops...', 'Something failed!')
                show_confirm.value = false
            }
        })
    }

    const rowClass = (data: any) => {
        return [{ '!bg-[#D0BCFF]': audio_playing.value && audio_playing.value?.id === data.id }];
    };

    /* ----- Audio Player ----- */
    const is_audio_playing = ref(false)
    const is_audio_loading = ref(false)
    const is_audio_paused = ref(false)
    const is_audio_error = ref(false)
    const show_controls = ref(false)

    const reset_states = () => {
        is_audio_playing.value = false
        is_audio_loading.value = false
        is_audio_paused.value = false
        is_audio_error.value = false
    }

    watch(() => audio_playing.value, (newVal: Audio | null) => {
        if(!newVal) {
            audio_playing.value = null
            return
        }
        reset_states()
    })

    const select_previous_audio = () => {
        if(!audio_playing.value) return
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === audio_playing?.value?.id)
        const new_position = (current_position === 0) ? user_audios.value.length - 1 : current_position - 1
        audio_playing.value = user_audios.value[new_position]
    }

    const select_next_audio = () => {
        if(!audio_playing.value) return
        const current_position = user_audios.value.findIndex((audio: Audio) => audio.id === audio_playing?.value?.id)
        const new_position = (current_position === user_audios.value.length - 1) ? 0 : current_position + 1
        audio_playing.value = user_audios.value[new_position]
    }

    const handle_player_action = (action: string) => {
        reset_states()
        switch(action) {
            case 'loading':
                is_audio_loading.value = true
                break
            case 'play':
                is_audio_playing.value = true
                break
            case 'pause':
                is_audio_paused.value = true
                break
            case 'error':
                is_audio_error.value = true
                show_error_toast('Sorry!', "This audio can't be played");
                break
            case 'prev':
                select_previous_audio()
                break
            case 'next':
                select_next_audio()
                break
            default:
                break
        }
    }
    /* ----- Audio Player ----- */
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