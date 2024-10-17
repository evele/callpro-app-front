<template>
    <div class="w-full table-container max-w-[44rem] rounded-2xl py-5 px-4 text-sm bg-white">
        <DataTable 
            :value="formatted_contacts"
            scrollable 
            tableStyle="min-width: 50rem"
            class="table" 
            :paginator="show_pagination" 
            :rows="10" 
            dataKey="id"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            lazy
            :loading="isLoading"
            :totalRecords="total_records"
            @page="onPageChange($event)"
            v-model:expandedRows="expandedRows"
            :rowClass="rowClass"
            selectionMode="single"
            @rowSelect="onRowSelect"
        >

            <template #header>
                <header class="flex flex-col w-full gap-5 mb-4">
                    <div class="flex justify-between items-center w-full">
                        <div class="relative inline-block">
                            <SearchSVG class="absolute left-[10px] top-[11px]"/>
                            <InputText type="text" placeholder="Search by Name, Phone or Group" class="w-72 h-10 py-2 pl-9 pr-[10px] rounded-8" />
                        </div>

                        <div class="flex gap-4">
                            <Button :class="action_button_style">
                                <FilterSVG class="text-[#757575]" />
                                <span class="font-semibold">Filter</span>
                            </Button>
                            <Button :class="action_button_style">
                                <SortBySVG class="text-[#757575]" />
                                <span class="font-semibold">Sort by</span>
                            </Button>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <Button @click="handle_group_action('add')" class="rounded-md" disabled>
                            <PlusRoundedSVG class="w-5 h-5" />
                            <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">Add to Group</span>
                        </Button>
                        <Button @click="handle_group_action('move')" class="rounded-md" disabled>
                            <MoveSVG class="w-5 h-5" />
                            <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">Move to Group</span>
                        </Button>
                        <Button @click="handle_group_action('trash')" class="rounded-md" disabled>
                            <TrashSVG class="w-5 h-5" />
                            <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">Send to Trash</span>
                        </Button>
                    </div>
                </header>
            </template>

            <Column headerStyle="width: 3rem">
                <template #header>
                    <Checkbox v-model="all_selected" :binary="true" @change="handle_select_all" />                                   
                </template>

                <template #body="slotProps">
                    <Checkbox v-model="selected_contacts" :inputId="slotProps.data.id" :value="slotProps.data.id" @click.stop @change="handle_select_contact(slotProps.data.id, $event)" />                                  
                </template>
            </Column>

            <Column field="name" header="Name" class="text-left">
                <template #body="slotProps">
                    <span class="text-[#1D1B20]">{{ slotProps.data.name }}</span>
                </template>
            </Column>

            <Column field="number" header="Phone" class="text-center">
                <template #body="slotProps">
                    <div class="relative flex items-center justify-cente h-16">
                        <span class="text-[#797676] w-full">{{ slotProps.data.number }}</span>
                        <span v-if="slotProps.data.total_numbers > 1" class="absolute -right-3 top-5 bg-[#49454F] text-white text-[10px] py-[1px] px-2 rounded-xl font-medium"> + {{ slotProps.data.total_numbers -1 }}</span>
                    </div>
                </template>
            </Column>

            <Column field="groups" header="Groups" class="text-center">
                <template #body="slotProps">
                    <span class="font-semibold">{{ slotProps.data.total_groups }}</span>
                </template>
            </Column>

            <Column field="dnc" header="" class="text-center">
                <template #header>
                    <div class="flex justify-center pl-[14px] text-white font-semibold">
                        <span>DNC</span>
                        <ErrorIconSVG />
                    </div>
                </template>
                <template #body="slotProps">
                    <span v-if="slotProps.data.dnc > 0 && slotProps.data.dnc != slotProps.data.total_numbers">-</span>
                    <DncSVG v-else-if="slotProps.data.dnc > 0" class="text-[#751617] w-full" />
                    <PhoneSVG v-else class="w-full" />
                </template>
            </Column>

            <Column expander>
                <template #body="slotProps">
                    <Button class="flex justify-center items-center bg-transparent border-none w-9 h-9" @click.stop @click="toggleRow(slotProps.data.id)">
                        <template #icon>
                            <ChevronUpSVG v-if="isRowExpanded(slotProps.data.id)" class="text-[#302f31]" />
                            <ChevronDownSVG v-else class="text-[#302f31]" />
                        </template>
                    </Button>
                </template>
            </Column>


            <template #expansion>
                <DataTable 
                    :value="formatted_contact"
                    tableStyle="min-width: 35rem"
                >
                    <Column headerStyle="width: 3rem">
                        <template #body="slotProps">
                            <div class="w-14 flex items-center justify-end">
                                <Checkbox v-model="selected_numbers" :value="slotProps.data.number_id" @change="handle_select_number(slotProps.data.number_id, slotProps.data.id)" />
                            </div>
                        </template>
                    </Column>
                    <Column field="name" header="" class="text-left" style="width: 30%;">
                        <template #body="slotProps">
                            <span class="text-[#1D1B20] pl-4">
                                {{ format_contact_type(slotProps.data.type) }}
                            </span>
                        </template>
                    </Column>

                    <Column field="number" header="" class="text-center" style="width: 20%;">
                        <template #body="slotProps">
                            <span class="text-[#797676] pl-6">
                                {{ slotProps.data.number }}
                            </span>
                        </template>
                    </Column>

                    <Column field="groups" header="" class="text-center" style="width: 25%; padding-left: 0;">
                        <template #body="slotProps">
                            <div class="flex justify-center gap-1">
                                <span class="rounded-xl bg-[#EBFFEE] text-xs font-semibold text-[#49454F] px-2 pt-[2px] pb-[3px]" v-for="(group, g_i) in [slotProps.data.group]" :key="g_i">Group {{ g_i + 1 }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="dnc" header="" class="text-center" style="width: 9%; padding-left: 12px;">
                        <template #body="slotProps">
                            <span>
                                <DncSVG v-if="slotProps.data.dnc === '1'" class="text-[#751617]" />
                                <PhoneSVG v-else />
                            </span>
                        </template>
                    </Column>

                    <Column field="empty" header="" class="text-center" style="width: 20%;">
                        <template body>
                            <span>
                            </span>
                        </template>
                    </Column>
                </DataTable>
            </template>

            <template #empty>
                <tr v-if="isLoading">
                    <td>
                        Loading Contacts...
                    </td>
                </tr>
                <tr v-else>
                    <td>
                        You currently have no contacts saved. Select one of the options above to continue.
                    </td>
                </tr>
            </template>

            <template #paginatorstart>
                <div class="flex gap-4">
                    <Button type="button" :class="action_button_style" @click="emit('uploadFile', true)">
                        <UploadSVG class="w-5 h-5 text-[#757575]" />
                        <span class="font-semibold">Upload file</span>
                    </Button>

                    <Button type="button" :class="action_button_style" @click="download_contacts">
                        <DownloadSVG class="text-[#757575]" />
                        <span class="font-semibold">Download list</span>
                    </Button>
                </div>
            </template>
        </DataTable>
    </div>
    
</template>

<script setup lang="ts">
    import { format_contact_type } from '@/utils/functions';

    const props = defineProps({
        selectedTab: { type: String, required: true }
    })

    const page = ref(1)    
    const show = ref(10)
    const with_groups = ref(true)
    const is_custom_group = ref(false)
    const search = ref("")
    const total_records = ref()

    const expandedRows = ref<{ [key: string]: boolean }>({});
    const formatted_contact: Ref<FormattedContact[]> = ref([]);
    const associative_array = ref([])

    const emit = defineEmits(['uploadFile'])

    type FormattedContact = {
        dnc: ZeroOrOne,
        group: string[],
        number: string,
        type: OneToFour,
        selected: boolean,
        number_id: string
    }

    type ContactRow = {
        id: string,
        name: string,
        number: string,
        total_numbers: number,
        total_groups: number,
        dnc: number,
    }

    const { data: SGData, isLoading: isLoadingSG, isSuccess: isSuccessSG, isError: isErrorSG } = useFetchGetSystemGroups()
    const { data: CGData, isLoading: isLoadingCG, isSuccess: isSuccessCG, isError: isErrorCG } = useFetchGetCustomGroups() 
    const { data: all_contacts_data, error, isLoading,isSuccess, isError, refetch } = useFetchAllContacts(page,show,with_groups,is_custom_group,props.selectedTab,search) 
    const { mutate: moveNumberToGroup, isPending: MTGIsPending, isError: MTGIsError, isSuccess: MTGIsSuccess } = useMoveNumberToGroup()
    const { mutate: addNumberToGroup, isPending: ATGIsPending, isError: ATGIIsError, isSuccess: ATGIIsSuccess } = useAddNumberToGroup()
    const { refetch: download } = useFetchDownloadContacts(props.selectedTab, false)

    const contacts_data = computed(() => {
        if(!all_contacts_data?.value?.result) return { contacts: [], total_numbers: 0 }
        return all_contacts_data?.value
    })

    const show_pagination = computed(() => contacts_data.value.contacts.length ? true : false);

    // Contacts that are shown in the main table
    const formatted_contacts = computed(() => {
        total_records.value = contacts_data.value.total_numbers;
        if(!contacts_data.value.contacts) return []

        const groupedContacts: ContactRow[] = contacts_data.value?.contacts?.reduce((acc: any, contact: ContactPhoneNumber) => {
            if (acc[contact.id]) {
                acc[contact.id].total_numbers += 1;
                acc[contact.id].dnc += +contact.dnc 
                if(typeof contact.number_groups === 'string') {
                    acc[contact.id].total_groups += get_number_groups(contact.number_groups).length;
                }
            } else {
                acc[contact.id] = {
                    id: contact.id,
                    name: show_full_name(contact.first_name, contact.last_name),
                    number: format_number_to_show(contact.number),
                    total_numbers: 1,
                    total_groups: typeof contact.number_groups === 'string' ? get_number_groups(contact.number_groups).length : 0,
                    dnc: +contact.dnc,
                };

            }

            if (!associative_array.value[contact.id]) {
                associative_array.value[contact.id] = [];
            }
    
            if (!associative_array.value[contact.id].includes(contact.number_id)) {
                associative_array.value[contact.id].push(contact.number_id);
            }

            return acc;
        }, {});

        console.log(associative_array.value)
        return Object.values(groupedContacts);
    });

    // Handle pagination
    const onPageChange = (event: any) => {
        page.value = event.page + 1
        all_selected.value = false;
        selected_contacts.value = [];
        expandedRows.value = {};
    }

    // When the expand button is clicked, it expands the row and shows the contact data
    const toggleRow = (id: string) => {
        let is_same_row = false;
        if(Object.keys(expandedRows.value).length) {
            is_same_row = Object.keys(expandedRows.value)[0] === id;
            expandedRows.value = {};
        } 
        if(is_same_row) return;
        expandedRows.value[id] = true;
        format_expanded_contact(id);
    }

    // Contact data that is shown in the expanded row
    const format_expanded_contact = (id: string | number) => {
        if(!contacts_data.value?.contacts) return [];

        formatted_contact.value = contacts_data.value.contacts
                            ?.filter((contact: ContactPhoneNumber) => contact.id === id)
                            .map((contact: ContactPhoneNumber) => {
                                return {
                                    type: contact.type,
                                    number: format_number_to_show(contact.number),
                                    group: typeof contact.number_groups === 'string' ? get_number_groups(contact.number_groups) : [],
                                    dnc: contact.dnc,
                                    number_id: contact.number_id,
                                    id: contact.id,
                                }
                            })
    }

    const isRowExpanded = (id: string) => !!expandedRows.value[id];

    const get_number_groups = (groups: string) => groups === null ? [] : groups.trim().split(/\s*,\s*/);

    // These next 2 functions will be deleted in the future
    const target_groups = computed(() => {
        if(CGData?.value?.result && CGData?.value?.custom_groups?.length) {
            return CGData.value.custom_groups.map((group: CustomGroup) => group.id).slice(0, 2)
        }
    })

    const hardcoded_contact_data = computed(() => {
        if(all_contacts_data?.value?.result && all_contacts_data?.value?.contacts?.length) {
            const contact = all_contacts_data.value.contacts.find((c: any) => c.number_groups !== "0" && c.number_groups?.length < 5)
            if(contact) return { number_id: contact.number_id, group_id: contact.number_groups }; 
        }
        return null
    })

    const handle_group_action = (action: string) => {
        console.log(action)
        return
        if(action === 'move') {
            const data_to_send: MoveNumberToGroup = {
                number_id: [{ number_id: hardcoded_contact_data?.value?.number_id }],
                groups: target_groups?.value,
                current_group_id: hardcoded_contact_data?.value?.group_id
            }
            console.log('move', data_to_send)

            moveNumberToGroup(data_to_send)
        } else if(action === 'add') {
            const data_to_send: AddNumberToGroup = {
                number_id: [{ number_id: hardcoded_contact_data?.value?.number_id }],
                groups: target_groups?.value
            }
            console.log('add', data_to_send)

            addNumberToGroup(data_to_send)
        } else {
            return 'Error';
        }
    }


    const download_contacts = () => {
        download();
    };

    /* ----- Here we handle the all the checkboxes in the table ----- */
    const all_selected = ref(false);
    const selected_contacts = ref([]);
    const selected_numbers = ref([]);

    // To select all contacts
    const handle_select_all = () => {
        selected_contacts.value = all_selected.value ? formatted_contacts.value.map((contact: ContactRow) => contact.id) : [];
        console.log(selected_contacts.value)
    }

    // To select a single contact
    const handle_select_contact = (id: string, event: any) => {
        if(selected_contacts.value.includes(id) || Object.keys(expandedRows.value)[0] === id) { // To close the expanded row
            toggleRow(id)
        }

        //TODO: CONTINUAR ACÁ, TENGO QUE HACER LA DESSELECCIÓN DE LOS NÚMEROS
        if(event.target.checked) {
            associative_array.value[id].forEach((number_id: string) => {
                selected_numbers.value.push(number_id);
            });
        }
        
        console.log(selected_numbers.value)
        all_selected.value = selected_contacts.value.length === formatted_contacts.value.length;
    }

    // To select a single number
    const handle_select_number = (number_id: string, contact_id: string) => {
        console.log(number_id, contact_id)
        console.log(selected_numbers.value)
    }

    // When a row is clicked, it expands
    const onRowSelect = (event: any) => {
        toggleRow(event.data.id)
    };

    const rowClass = (data: ContactRow) => {
        return [{ '!bg-[#E9DDFF]': selected_contacts.value.includes(data.id) }];
    };

    const action_button_style = 'bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none';
</script>

<style scoped lang="scss">
::v-deep(.table) {
    .p-datatable-table {
        border-collapse: collapse;
        width: 100%;
    }

    .p-datatable-thead, .p-datatable-header-cell {
        background-color: #9A83DB;
        line-height: 28px;
    
        &:first-child {
            border-top-left-radius: 6px;
        }
        &:last-child {
            border-top-right-radius: 6px;
        }

        tr {
            th:nth-child(n+3) {
                .p-datatable-column-header-content {
                    display: flex;
                    justify-content: center;
                }
            }
        }

        .p-datatable-column-title {
            color: white;
            font-weight: 600;
        }
    }

    .p-datatable-column-title {
        text-align: center;
    }

    .p-checkbox-input, .p-checkbox-box {
        border-radius: 2px
    }

    tr {
        &:hover {
            cursor: pointer;
            background-color: #ebe5f7;
        }
    }

    .p-datatable-paginator-bottom {
        border: none;
        margin-top: 15px;

        .p-paginator-prev, .p-paginator-page, .p-paginator-next {
            background-color: transparent;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s;
            height: 35px;

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

    /* ----- Sub table ----- */
    .p-datatable-row-expansion {
        .p-datatable-thead, .p-datatable-header-cell {
            display: none;
        }

        td {
            padding: 0;
            height: 40px;
            vertical-align: middle;
        }

        .p-checkbox {
            width: 14px;
            height: 14px;
            .p-checkbox-input, .p-checkbox-box {
                width: 14px;
                height: 14px;
                border-radius: 2px
            }
        } 
    }
}

    .table-container {
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

        @media (min-width: 980px) {
            max-width: 800px;
        }
        @media (min-width: 1100px) {
            max-width: 850px;
        }
    }
</style>