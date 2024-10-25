<template>
   <Dialog v-model:visible="visible" modal :closable="false" contentStyle="overflow: hidden;" class="w-full max-w-[850px] mx-4 flex flex-col gap-4 md:gap-7 dnc-modal">
        <template #header>
            <header class="w-full flex justify-between pb-5">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">Add new contact <ChevronDownSVG /></h2>
                <Button @click="close" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <section class="flex flex-col gap-4 md:gap-7 overflow-hidden">
            <div class="flex flex-col gap-4 sm:flex-row sm:gap-0 justify-between">
                <div class="relative inline-block">
                    <SearchSVG class="absolute left-[10px] top-[11px]"/>
                    <InputText type="text" placeholder="Search by Name or Phone" class="w-72 h-10 py-2 pl-9 pr-[10px] rounded-8" @input="debounceSearch" />
                </div>

                <div class="flex gap-2 md:gap-4">
                    <Button type="button" class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none" @click="console.log('upload')">
                        <UploadSVG class="w-5 h-5 text-[#757575]" />
                        <span class="font-semibold text-sm md:text-base">Upload file</span>
                    </Button>

                    <Button type="button"class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none" @click="download()">
                        <DownloadSVG class="text-[#757575]" />
                        <span class="font-semibold text-sm md:text-base">Download list</span>
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
            
            <div>
                <DataTable
                    v-model:selection="selected_contacts" 
                    :value="dnc_contacts_data.dnc_contacts" 
                    scrollable 
                    scrollHeight="500px"
                    scrollDirection="both"
                    dataKey="number" 
                    class="dnc-table pb-20 mb-20"
                    stripedRows
                    :rowClass="rowClass"
                    selectionMode="multiple"
                >
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="number" header="Phone" class="text-center min-w-[150px]"></Column>

                    <Column field="number_id" header="" class="text-center">
                        <template #header>
                            <div class="relative">
                                <span class="font-bold">Contacts</span>
                                <span
                                    v-tooltip.top="{
                                        value: 'This number belongs to a contact',
                                        pt: { text: 'text-sm font-light', root: 'max-w-[400px]'}
                                    }"
                                    class="absolute -right-4 text-xs bg-[#49454F] text-white py-[1px] px-[4px] rounded-xl font-medium leading-none"> 
                                    ?
                                </span>
                            </div>
                        </template>
                        <template #body="slotProps">
                            <Chip v-if="slotProps.data.number_id !== null" 
                                label="Yes" class="bg-[#EADDFF] text-[#49454F] font-bold"
                            />
                            <Chip v-else
                                label="No" class="bg-[#E6E6E6] text-[#49454F] font-bold"
                            />
                        </template>
                    </Column>

                    <Column field="blocked_by" header="Blocked by" class="text-center" headerStyle="min-width: 150px">
                        <template #body="slotProps">
                            <Chip v-if="slotProps.data.dnc == '1'" 
                                label="You" class="bg-[#FFFBEB] text-[#49454F] font-bold"
                            />
                            <Chip v-else
                                label="Admin" class="bg-[#FEE9E7] text-[#49454F] font-bold"
                            />
                        </template>
                    </Column>

                </DataTable>
            </div>
            
        </section>

        <template #footer>
            <div class="flex flex-col w-full">
                <form @submit.prevent class="flex justify-end items-center gap-4 w-full">
                    <div class="flex gap-4">
                        <PhoneInput :model-value="new_number" @update:modelValue="(v: string) => new_number = v" />
                        
                        <Button @click="add_new_number" :class="[ add_is_pending ? 'w-32' : 'w-28']" class="bg-[#1D192B] border-none rounded-xl text-white hover:bg-[#322F35] disabled:bg-[#848287]"
                            :disabled="disabled_add_new_btn">
                            <div class="flex items-center gap-2" v-if="add_is_pending">
                                <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5"
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

                <footer class="flex justify-center w-full font-bold mt-7">
                    <Button @click="close" class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E]">
                        Ready
                    </Button>
                </footer>
            </div>
        </template>
        <ConfirmDialog class="confirm-dialog">
            <template #message>
                <p class="my-4 text-lg font-semibold">{{ message_text }}</p>
            </template>
        </ConfirmDialog>
        <Toast />
    </Dialog>
</template>

<script setup lang="ts">
    import { useConfirm } from "primevue/useconfirm";
    import { useToast } from 'primevue/usetoast';

    const confirm = useConfirm();
    const toast = useToast();
    const message_text = ref('')

    const visible = ref(false);
    const page = ref(1)
    const show = ref(10)
    const search = ref('')

    const selected_contacts = ref([])
    const selected_group = ref('dnc') // TODO: PREGUNTAR POR ESTO

    const new_number = ref('')

    const { data: dnc_contacts, isLoading: dnc_is_loading } = useFetchDNCContacts(page,show,search)
    const { mutate: add_dnc_contact, isPending: add_is_pending } = useAddDNCContact()
    const { mutate: send_to_trash, isPending: trash_is_pending } = useSendContactToTrash()
    const { mutate: remove_from_dnc, isPending: remove_is_pending } = useRemoveNumberFromDNC()
    const { refetch: download } = useFetchDownloadContacts(selected_group.value, false) //TODO: REEMPLAZAR ESTO CON FUNCION NUEVA PARA DNC

    type FormatedContact = {
        name: string,
        number: string,
        number_id: string | null,
        dnc: '1' | '2'
    }

    // Format the number to show in the table
    const dnc_contacts_data = computed(() => {
        if(!dnc_contacts?.value?.result) return { dnc_contacts: [], dnc_total_contacts: 0 }

        const formatted_contacts: FormatedContact = dnc_contacts?.value?.dnc_contacts.map((contact: ContactDNC) => {
            const { first_name, last_name, number, ...rest } = contact;
            return {
                name: show_full_name(first_name, last_name),
                number: format_number_to_show(number),
                ...rest
            }
        })

        return { dnc_contacts: formatted_contacts, dnc_total_contacts: dnc_contacts?.value?.dnc_total_contacts }
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
    const disabled_add_new_btn = computed(() => !new_number.value)

    const show_error_toast = (title: string, error: string) => toast.add({ severity: 'error', summary: title, detail: error, life: 3000 });
    const show_success_toast = (title: string, message: string) => toast.add({ severity: 'success', summary: title, detail: message, life: 3000 });

    // Filter and format the numbers to send to API
    const handle_comfirm = (action: 'trash' | 'dnc') => {
        if(action === 'trash') {
            const number_ids = selected_contacts.value.filter((contact: FormatedContact) => contact.number_id !== null && contact.dnc !== '2')
                                                    .map((contact: FormatedContact) => format_number_to_send(contact.number_id!))
                                                    
            const data_to_send = {
                numbers_ids: number_ids
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

    // Close the confirmation modal
    const handle_cancel = () => {
        console.log('cancel')
    }

    // Show confirmation modal
    const confirm_modal = (action: 'trash' | 'dnc') => {
        message_text.value = action === 'trash' ? 
                            'Are you sure you want to send the selected contact numbers to trash?' : 
                            'Are you sure you want to remove all selected numbers from DNC list?'
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
            },
            reject: () => {
                handle_cancel()
            }
        });
    };

    // Add new number to DNC list
    const add_new_number = () => {
        const data_to_send = {
            number: format_number_to_send(new_number.value)
        }

        add_dnc_contact(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    new_number.value = ''
                    show_success_toast('Success!', 'Number successfully added!')
                } else {
                    show_error_toast('Oops...', 'Error adding number...')
                }
            },
            onError: () => show_error_toast('Oops...', 'Error adding number...')
        })
    }

    const open = () => {
        visible.value = true;
    }

    const close = () => {
        visible.value = false;
    }

    defineExpose({ open });

    const rowClass = (data: any) => {
        return [{ '!bg-[#E9DDFF]': selected_contacts.value.some((contact: FormatedContact) => contact.number === data.number) }];
    };
</script>

<style scoped lang="scss">
::v-deep(.dnc-table) {
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
::v-deep(.p-progressspinner) {
    .p-progressspinner-circle {
        stroke: white!important;
    }
}
</style>