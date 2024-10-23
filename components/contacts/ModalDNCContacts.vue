<template>
   <Dialog v-model:visible="visible" modal :closable="false" contentStyle="overflow: hidden;" class="w-full max-w-[850px] mx-4 flex flex-col gap-7 dnc-modal">
        <template #header>
            <header class="w-full flex justify-between pb-5">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">Add new contact <ChevronDownSVG /></h2>
                <Button @click="close" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <section class="flex flex-col gap-7 overflow-hidden">
            <div class="flex justify-between">
                <div class="relative inline-block">
                    <SearchSVG class="absolute left-[10px] top-[11px]"/>
                    <InputText type="text" placeholder="Search by Name or Phone" class="w-72 h-10 py-2 pl-9 pr-[10px] rounded-8" @input="debounceSearch" />
                </div>

                <div class="flex gap-4">
                    <Button type="button" class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none" @click="console.log('upload')">
                        <UploadSVG class="w-5 h-5 text-[#757575]" />
                        <span class="font-semibold">Upload file</span>
                    </Button>

                    <Button type="button"class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none" @click="console.log('download')">
                        <DownloadSVG class="text-[#757575]" />
                        <span class="font-semibold">Download list</span>
                    </Button>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <Button @click="send_to_trash" class="rounded-md bg-transparent text-black" :disabled="!disabled_send_to_trash_btn">
                    <div class="flex items-center gap-2">
                        <TrashSVG class="w-5 h-5" />
                        <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">Send to Trash</span>
                    </div>
                </Button>
                <Button @click="remove_from_dnc" class="rounded-md bg-transparent text-black" :disabled="!selected_contacts.length">
                    <div class="flex items-center gap-2">
                        <ScissorsSVG class="w-5 h-5" />
                        <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">Remove from DNC</span>
                    </div>
                </Button>
            </div>
            
            <section>
                <DataTable 
                    v-model:selection="selected_contacts" 
                    :value="dnc_contacts_data.dnc_contacts" 
                    scrollable 
                    scrollHeight="320px" 
                    dataKey="number" 
                    class="dnc-table"
                    stripedRows
                    :rowClass="rowClass"
                    selectionMode="multiple"
                >
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="number" header="Phone" class="text-center"></Column>

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

                    <Column field="blocked_by" header="Blocked by" class="text-center">
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
            </section>
        </section>

        <template #footer>
            <footer class="w-full flex justify-center font-bold mt-7">
                <Button @click="close" class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E]">
                    Ready
                </Button>
            </footer>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const visible = ref(false);
    const page = ref(1)
    const show = ref(10)
    const search = ref('')

    const selected_contacts = ref([])
    const selected_group = ref('dnc') // TODO: PREGUNTAR POR ESTO

    const { data: dnc_contacts, isLoading: dnc_is_loading, isSuccess: dnc_is_success, refetch: dnc_refetch } = useFetchDNCContacts(page,show,search)
    const { refetch: download } = useFetchDownloadContacts(selected_group.value, false)

    type FormatedContact = {
        name: string,
        number: string,
        number_id: string | null,
        blocked_by: '1' | '2'
    }

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
    
    let searchDebounce: ReturnType<typeof setTimeout>
    const debounceSearch = (e: Event) => {
        clearTimeout(searchDebounce)
        searchDebounce = setTimeout(() => {
            const target = e.target as HTMLInputElement;
            search.value = target.value
        }, 500)
    }

    const disabled_send_to_trash_btn = computed(() => selected_contacts.value.length && selected_contacts.value.some((contact: FormatedContact) => contact.number_id !== null))

    const send_to_trash = () => {
        console.log('send to trash')
    }

    const remove_from_dnc = () => {
        console.log('remove from dnc')
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
</style>