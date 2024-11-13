<template>
   <Dialog v-model:visible="show_dnc_modal" modal :draggable="false" :closable="false" contentStyle="overflow: hidden;" class="w-full max-w-[850px] mx-4 flex flex-col gap-4 md:gap-7 dnc-modal">
        <template #header>
            <header class="w-full flex justify-between pb-5">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">Add new contact <ChevronDownSVG /></h2>
                <Button @click="close" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <section class="flex flex-col gap-4 md:gap-7 overflow-hidden flex-grow">
            <div class="flex flex-col gap-4 sm:flex-row sm:gap-0 justify-between">
                <div class="relative inline-block">
                    <SearchSVG class="absolute left-[10px] top-[11px]"/>
                    <InputText type="text" placeholder="Search by Name or Phone" class="w-72 h-10 py-2 pl-9 pr-[10px] rounded-8" @input="debounceSearch" />
                </div>

                <div class="flex gap-2 md:gap-4">
                    <Button type="button" class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none" @click="open_upload_dnc_contact">
                        <UploadSVG class="w-5 h-5 text-[#757575]" />
                        <span class="font-semibold text-sm md:text-base">Upload file</span>
                    </Button>

                    <Button type="button"class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none" @click="download_list">
                        <ProgressSpinner v-if="is_downloading" strokeWidth="8" fill="transparent" class="h-5 w-5 dark-spinner"
                            animationDuration=".5s" aria-label="Adding contact to DNC"                             
                        />
                        <DownloadSVG v-else class="text-[#757575]" />
                        <span class="font-semibold text-sm md:text-base">{{ is_downloading ? 'Downloading' : 'Download list' }}</span>
                    </Button>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <Button @click="confirm_modal('trash')" class="rounded-md bg-transparent text-black hover:bg-[#e9e6e6] disabled:bg-transparent" :disabled="!disabled_send_to_trash_btn">
                    <div class="flex items-center gap-2">
                        <TrashSVG class="w-5 h-5" />
                        <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">Send to Trash</span>
                    </div>
                </Button>
                <Button @click="confirm_modal('dnc')" class="rounded-md bg-transparent text-black hover:bg-[#e9e6e6] disabled:bg-transparent" :disabled="!disabled_remove_from_dnc_btn">
                    <div class="flex items-center gap-2">
                        <ScissorsSVG class="w-5 h-5" />
                        <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">Remove from DNC</span>
                    </div>
                </Button>
            </div>
            
            <div class="flex-grow overflow-hidden">
                <ProgressBar v-if="is_fetching_dnc" mode="indeterminate" style="height: 6px"></ProgressBar>
                <DataTable
                    v-model:selection="selected_contacts" 
                    :value="dnc_contacts_data.dnc_contacts" 
                    scrollable
                    scrollHeight="calc(70vh - 280px)"
                    dataKey="id" 
                    class="dnc-table"
                    stripedRows
                    :rowClass="rowClass"
                    selectionMode="multiple"
                >
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name">
                        <template #body="slotProps">
                            <span class="text-sm">{{ slotProps.data.name }}</span>
                        </template>
                    </Column>
                    <Column field="number" header="Phone" class="text-center min-w-[150px]">
                        <template #body="slotProps">
                            <span class="text-sm text-[#797676]">{{ slotProps.data.number }}</span>
                        </template>
                    </Column>

                    <Column field="number_id" header="" class="text-center">
                        <template #header>
                            <div class="relative">
                                <span class="font-bold">Contacts</span>
                                <span
                                    v-tooltip.top="{
                                        value: 'This number belongs to a contact',
                                        pt: { text: 'text-sm font-light', root: 'max-w-[400px]'}
                                    }"
                                    class="absolute -right-4 text-xs bg-[#49454F] text-white pt-[2px] pb-[1px] px-[4px] rounded-xl font-medium leading-none"> 
                                    ?
                                </span>
                            </div>
                        </template>
                        <template #body="slotProps">
                            <Chip v-if="slotProps.data.number_id !== null" 
                                label="Yes" class="bg-[#EADDFF] min-w-[52px] text-[#49454F] text-xs font-bold h-6 rounded-[10px] px-2"
                            />
                            <Chip v-else
                                label="No" class="bg-[#E6E6E6] min-w-[52px] text-[#49454F] text-xs font-bold h-6 rounded-[10px] px-2"
                            />
                        </template>
                    </Column>

                    <Column field="blocked_by" header="Blocked by" class="text-center" headerStyle="min-width: 150px">
                        <template #body="slotProps">
                            <Chip v-if="slotProps.data.dnc == '1'" 
                                label="You" class="bg-[#FFFBEB] min-w-[52px] text-[#49454F] text-xs font-bold h-6 rounded-[10px] px-2"
                            />
                            <Chip v-else
                                label="Admin" class="bg-[#FEE9E7] min-w-[52px] text-[#49454F] text-xs font-bold h-6 rounded-[10px] px-2"
                            />
                        </template>
                    </Column>

                </DataTable>
            </div>
            
        </section>

        <template #footer>
            <div class="flex flex-col justify-between w-full h-28">
                <form @submit.prevent class="flex justify-end items-center gap-4 w-full">
                    <div class="flex gap-4">
                        <PhoneInput :model-value="new_number" @update:modelValue="(v: string) => new_number = v" 
                            :form-action="form_action" @hasError="(val: boolean) => has_phone_number_error = val"   
                        />
                        
                        <Button @click="add_new_number" :class="[ add_is_pending ? 'w-32' : 'w-28']" class="bg-[#1D192B] border-none rounded-xl text-white hover:bg-[#322F35] disabled:bg-[#848287]"
                            :disabled="disabled_add_new_btn">
                            <div class="flex items-center gap-2" v-if="add_is_pending">
                                <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner"
                                 animationDuration=".5s" aria-label="Adding contact to DNC"                             
                                />
                                Adding
                            </div>
                            <div class="flex items-center gap-2" v-else>
                                <PlusSVG class="w-6 h-6" />
                                <span class="text-sm">Add</span>
                            </div>
                        </Button>
                    </div>
                </form>

                <footer class="flex justify-center w-full font-bold">
                    <Button @click="close" class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E]">
                        Ready
                    </Button>
                </footer>
            </div>
        </template>

        <ModalUploadDNCContacts ref="uploadDNCContactModal" @show_toast="handle_show_upload_toast" />
    </Dialog>
</template>

<script setup lang="ts">
    import type { QueryObserverResult } from '@tanstack/vue-query'

    const confirm = useConfirm();
    const toast = useToast();
    const message_text = ref('')

    const show_dnc_modal= ref(false);
    const page = ref(1)
    const show = ref(0)
    const search = ref('')

    const selected_contacts = ref([])
    const new_number = ref('')
    const form_action = ref('')
    const has_phone_number_error = ref(false)

    const emit = defineEmits(['updateMessage'])

    const { data: dnc_contacts, isLoading: dnc_is_loading, isFetching: is_fetching_dnc } = useFetchDNCContacts(page,show,search)
    const { mutate: add_dnc_contact, isPending: add_is_pending } = useAddDNCContact()
    const { mutate: send_to_trash, isPending: trash_is_pending } = useSendContactToTrash()
    const { mutate: remove_from_dnc, isPending: remove_is_pending } = useRemoveNumberFromDNC()
    const { refetch: download, isFetching: is_downloading } = useFetchDownloadDNCContacts()

    type FormatedContact = {
        id: number,
        name: StringOrNull,
        number: string,
        number_id: StringOrNull,
        dnc: '1' | '2'
    }

    // Format the number to show in the table
    const dnc_contacts_data = computed(() => {
        selected_contacts.value = []
        if(!dnc_contacts?.value?.result) return { dnc_contacts: [], dnc_total_contacts: 0 }

        const formatted_contacts: FormatedContact[] = dnc_contacts?.value?.dnc_contacts.map((contact: ContactDNC, index: number) => {
            const { first_name, last_name, number, ...rest } = contact;
            return {
                id: index + 1,
                name: show_full_name(first_name, last_name),
                number: format_number_to_show(number),
                ...rest
            }
        })

        return { dnc_contacts: formatted_contacts.reverse(), dnc_total_contacts: dnc_contacts?.value?.dnc_total_contacts }
    })
    
    // Debounce the search input
    let searchDebounce: ReturnType<typeof setTimeout>
    const debounceSearch = (e: Event) => {
        clearTimeout(searchDebounce)
        searchDebounce = setTimeout(() => {
            const target = e.target as HTMLInputElement;
            search.value = target.value
        }, 500)
    }

    const disabled_remove_from_dnc_btn = computed(() => selected_contacts.value.length && selected_contacts.value.some((contact: FormatedContact) => contact.dnc !== '2'))
    const disabled_send_to_trash_btn = computed(() => selected_contacts.value.length && selected_contacts.value.some((contact: FormatedContact) => contact.number_id !== null))
    const disabled_add_new_btn = computed(() => !new_number.value || has_phone_number_error.value)

    const show_error_toast = (title: string, error: string) => toast.add({ severity: 'error', summary: title, detail: error, life: 3000 });
    const show_success_toast = (title: string, message: string) => toast.add({ severity: 'success', summary: title, detail: message, life: 3000 });

    // Filter and format the numbers to send to API
    const handle_comfirm = (action: 'trash' | 'dnc') => {
        if(action === 'trash') {
            const number_ids = selected_contacts.value.filter((contact: FormatedContact) => contact.number_id !== null && contact.dnc !== '2')
                                                    .map((contact: FormatedContact) => format_number_to_send(contact.number_id!))
                                                    
            const data_to_send = {
                number_ids: number_ids
            }

            send_to_trash(data_to_send, {
                onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                    if(response.result) {
                        selected_contacts.value = []
                        show_success_toast('Success!', 'Number successfully sent to trash!')
                        
                    } else {
                        show_error_toast('Oops...', 'Error sending number to trash...')
                    }
                },
                onError: () =>  show_error_toast('Oops...', 'Error sending number to trash...')
            })
        }

        if(action === 'dnc') {
            const numbers = selected_contacts.value.filter((contact: FormatedContact) => contact.dnc !== '2')
                                                    .map((contact: FormatedContact) => format_number_to_send(contact.number))
            
            const data_to_send = {
                numbers: numbers
            }

            remove_from_dnc(data_to_send, {
                onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                    if(response.result) {
                        selected_contacts.value = []
                        show_success_toast('Success!', 'Number successfully removed from DNC!')
                        
                    } else {
                        show_error_toast('Oops...', 'Error removing number from DNC...')
                    }
                },
                onError: () =>  show_error_toast('Oops...', 'Error removing number from DNC...')
            })
        }
    }

    // Show confirmation modal
    const confirm_modal = (action: 'trash' | 'dnc') => {
        message_text.value = action === 'trash' ? 
                            'Are you sure you want to send the selected contact numbers to trash?' : 
                            'Are you sure you want to remove all selected numbers from DNC list?'

        emit('updateMessage', message_text.value)
        confirm.require({
            header: 'Confirmation',
            rejectProps: {
                label: 'No',
                severity: 'secondary'
            },
            acceptProps: {
                label: 'Yes'
            },
            accept: () => {
                handle_comfirm(action)
            }
        });
    };

    // Add new number to DNC list
    const add_new_number = () => {
        form_action.value = ''
        const data_to_send = {
            number: format_number_to_send(new_number.value)
        }

        add_dnc_contact(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    new_number.value = ''
                    form_action.value = 'clear'
                    show_success_toast('Success!', 'Number successfully added!')
                } else {
                    show_error_toast('Oops...', 'Error adding number...')
                }
            },
            onError: () => show_error_toast('Oops...', 'Error adding number...')
        })
    }

    const download_list = () => {
        download()
            .then((result: QueryObserverResult) => {
                if (result.data) {
                    show_success_toast('Success!', 'List successfully downloaded!');
                } else {
                    show_error_toast('Oops...', 'Error downloading list...');
                }
            })
            .catch(() => {
                show_error_toast('Oops...', 'Error downloading list...');
            });
    }

    const uploadDNCContactModal = ref();
    const open_upload_dnc_contact = () => uploadDNCContactModal.value.open_upload_dnc_modal();

    const handle_show_upload_toast = (type: 'success' | 'error') => {
        if(type === 'success') {
            show_success_toast('Success!', 'File successfully uploaded!');
        } else {
            show_error_toast('Oops...', 'Error uploading file...');
        }
    }

    const open = () => {
        show_dnc_modal.value = true;
        form_action.value = ''
    }

    const close = () => {
        show_dnc_modal.value = false;
        selected_contacts.value = []
        search.value = ''
        new_number.value = ''
        form_action.value = 'clear'
    }

    defineExpose({ open });

    const rowClass = (data: any) => {
        return [{ '!bg-[#E9DDFF]': selected_contacts.value.some((contact: FormatedContact) => contact.id === data.id) }];
    };
</script>

<style scoped lang="scss">
:deep(.dnc-table) {
    min-width: 30rem;

    .p-datatable-thead, .p-datatable-header-cell {
        background-color: rgb(233, 231, 235);

        tr {
            th:nth-child(n+3) {
                .p-datatable-column-header-content {
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }

    td {
        height: 60px;
    }
}
:deep(.light-spinner) {
    .p-progressspinner-circle {
        stroke: white!important;
    }
}

:deep(.dark-spinner) {
    .p-progressspinner-circle {
        stroke: #757575!important;
    }
}

:deep(.p-chip-label){
    width: 100%;
} 
</style>