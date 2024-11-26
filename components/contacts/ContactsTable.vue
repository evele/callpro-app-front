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

                        <IconField class="w-full max-w-[300px]">
                            <InputIcon>
                                <SearchSVG class="text-[#757575]" />
                            </InputIcon>
                            <InputText class="py-2 w-full" placeholder="Search by Name, Phone or Group" />
                        </IconField>

                        <div class="flex gap-4">
                            <FilterDropdown :all-contacts="ALL" :filters-system="FILTERS_SYSTEM_GROUPS" :filters-custom="FILTERS_CUSTOM_GROUPS" @update:filters="handleUpdateFilters" />
                            <Button :class="action_button_style">
                                <SortBySVG class="text-[#757575]" />
                                <span class="font-semibold">Sort by</span>
                            </Button>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <Button @click="handle_group_action('add')" class="rounded-md bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white" :disabled="disabled_groups_action_btn">
                            <ProgressSpinner v-if="ATGIsPending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Adding number" />
                            <PlusRoundedSVG v-else class="w-5 h-5" />
                            <span class="text-sm font-bold tracking-wider leading-none pt-[2px]">{{ ATGIsPending ? 'Adding...' : 'Add to Group'}}</span>
                        </Button>

                        <Button @click="handle_group_action('move')" class="rounded-md bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white" :disabled="disabled_groups_action_btn">
                            <ProgressSpinner v-if="MTGIsPending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Moving number" />
                            <MoveSVG v-else class="w-5 h-5" />
                            <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ MTGIsPending ? 'Moving...' : 'Move to Group' }}</span>
                        </Button>

                        <Button @click="handle_group_action('trash')" class="rounded-md bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white" :disabled="disabled_groups_action_btn">
                            <ProgressSpinner v-if="STTIsPending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Moving number" />
                            <TrashSVG v-else class="w-5 h-5" />
                            <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ STTIsPending ? 'Sending...' : 'Send to Trash' }}</span>
                        </Button>
                    </div>
                </header>
            </template>

            <Column headerStyle="width: 3rem">
                <template #header>
                    <Checkbox v-model="all_selected" :binary="true" @change="handle_select_all" :indeterminate="indeterminate_all" />                                   
                </template>

                <template #body="slotProps">
                    <Checkbox v-model="selected_contacts" :inputId="slotProps.data.id" :value="slotProps.data.id" 
                        :indeterminate="indeterminate_contacts[slotProps.data.id]" @click.stop @change="handle_select_checkbox(slotProps.data.id, true)" />                                  
                </template>
            </Column>

            <Column field="name" header="Name" class="text-left">
                <template #body="slotProps">
                    <div class="text-[#1D1B20] relative w-fit">
                        {{ slotProps.data.name }}
                        <div v-show="Object.keys(expandedRows) == slotProps.data.id" class="absolute -top-[2px] -right-20 flex gap-2">
                            <Button class="bg-gray-200 py-[2px] px-[6px] border-none text-black hover:bg-[#9884cf] hover:text-white">
                                <EditIconSVG class="w-3 h-4" />
                            </Button>
                            <Button class="bg-gray-200 py-1 px-[6px] border-none text-black hover:bg-[#9884cf] hover:text-white">
                                <TrashSVG class="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </template>
            </Column>

            <Column field="number" header="Phone" class="text-center">
                <template #body="slotProps">
                    <div class="relative flex items-center" :class="[ Object.keys(expandedRows) == slotProps.data.id ? '' : 'h-11']">
                        <span class="text-[#797676] w-full">{{ hide_contact_data(slotProps.data.id) ? '' : slotProps.data.numbers[0] }}</span>
                        <span v-if="slotProps.data.total_numbers > 1 && !hide_contact_data(slotProps.data.id)"
                            v-tooltip.top="{
                                value: slotProps.data.numbers.slice(1).join(', '),
                                pt: { text: 'text-sm font-light', root: 'max-w-[400px]'}
                            }"
                            class="absolute -right-3 top-5 bg-[#49454F] text-white text-[10px] py-[1px] px-2 rounded-xl font-medium"> 
                            + {{ slotProps.data.total_numbers -1 }}
                        </span>
                    </div>
                </template>
            </Column>

            <Column field="groups" header="Groups" class="text-center">
                <template #body="slotProps">
                    <span class="font-semibold">{{ hide_contact_data(slotProps.data.id) ? '' : slotProps.data.total_groups }}</span>
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
                    <span v-if="hide_contact_data(slotProps.data.id)"></span>
                    <span v-else-if="slotProps.data.dnc > 0 && slotProps.data.dnc != slotProps.data.total_numbers">-</span>
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
                                <Checkbox v-model="selected_numbers" :value="slotProps.data.number_id" @change="handle_select_checkbox(slotProps.data.id, false)" />
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
                            <div class="relative flex justify-center gap-1 items-center">
                                <span v-if="slotProps.data.group.length > 0" class="rounded-xl bg-[#EBFFEE] text-xs font-semibold text-[#49454F] px-2 pt-[2px] pb-[3px]">{{ slotProps.data?.group[0] }}</span>
                                <span v-if="slotProps.data.group.length > 1"
                                    v-tooltip.top="{
                                        value: get_number_group_name(slotProps.data.group.slice(1)).join(', '),
                                        pt: { text: 'text-sm font-light', root: 'max-w-[400px]'}
                                    }"
                                    class="absolute right-10 bg-[#49454F] text-white px-2 rounded-xl font-medium leading-none h-4"> 
                                    ...
                                </span>
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
                    <Button type="button" :class="action_button_style" @click="emit('uploadFile', 'upload')">
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
    const props = defineProps({
        selectedTab: { type: String, required: true },
        dncTotalNumbers: { type: [Number, null], required: true }
    })

    const confirm = useConfirm()
    const toast = useToast()

    const page = ref(1)    
    const show = ref(10)
    const with_groups = ref(true)
    const is_custom_group = ref(false)
    const search = ref("")
    const total_records = ref()

    const expandedRows = ref<{ [key: string]: boolean }>({});
    const formatted_contact: Ref<FormattedContact[]> = ref([]);
    const associative_array = ref<{ [key: string]: string[] }>({})
    const indeterminate_all = ref(false);
    const indeterminate_contacts = ref<{ [key: string]: boolean }>({});
    const numbers_ids = ref<string[]>([])

    const emit = defineEmits(['uploadFile', 'updateMessage'])

    /* ----- Types ----- */
    type FormattedContact = { // This is the data that is shown in the expanded row
        dnc: ZeroOrOne,
        group: string[],
        number: string,
        type: OneToFour,
        number_id: string,
        id: number,
    }

    type ContactRow = { // This is the data that is shown in the main table
        id: string,
        name: string | null,
        numbers: string[],
        total_numbers: number,
        total_groups: number,
        dnc: number,
    }

    type GroupedContacts = {
        [key: string]: ContactRow;
    }

    const { data: SGData, isLoading: isLoadingSG, isSuccess: isSuccessSG, isError: isErrorSG } = useFetchGetSystemGroups()
    const { data: CGData, isLoading: isLoadingCG, isSuccess: isSuccessCG, isError: isErrorCG } = useFetchGetCustomGroups() 
    const { data: all_contacts_data, error, isLoading,isSuccess, isError, refetch } = useFetchAllContacts(page,show,with_groups,is_custom_group,props.selectedTab,search) 
    const { mutate: moveNumberToGroup, isPending: MTGIsPending } = useMoveNumberToGroup()
    const { mutate: addNumberToGroup, isPending: ATGIsPending } = useAddNumberToGroup()
    const { mutate: sendNumberToTrash, isPending: STTIsPending } = useSendNumberToTrash()
    const { refetch: download } = useFetchDownloadContacts(props.selectedTab, false)

    const contacts_data = computed(() => {
        if(!all_contacts_data?.value?.result) return { contacts: [], total_numbers: 0 }
        return all_contacts_data?.value
    })

    const custom_groups = computed(() => {
        if(!CGData?.value?.result) return []
        return CGData?.value.custom_groups
    })

    const system_groups = computed<SystemGroup | null>(() => {
        if(!SGData?.value?.result) return null
        return SGData?.value.system_groups
    })

    const show_pagination = computed(() => contacts_data.value.contacts.length ? true : false);

    // Contacts that are shown in the main table
    const formatted_contacts = computed(() => {
        total_records.value = contacts_data.value.total_numbers;
        if(!contacts_data.value.contacts) return []

        const groupedContacts: GroupedContacts = contacts_data.value?.contacts?.reduce((acc: GroupedContacts, contact: ContactPhoneNumber) => {
            if (acc[contact.id]) {
                acc[contact.id].total_numbers += 1;
                acc[contact.id].dnc += +contact.dnc
                acc[contact.id].numbers.push(format_number_to_show(contact.number));
                if(typeof contact.number_groups === 'string') {
                    acc[contact.id].total_groups += get_number_groups(contact.number_groups).length;
                }
            } else {
                acc[contact.id] = {
                    id: String(contact.id),
                    name: show_full_name(contact.first_name, contact.last_name),
                    numbers: [format_number_to_show(contact.number)],
                    total_numbers: 1,
                    total_groups: typeof contact.number_groups === 'string' ? get_number_groups(contact.number_groups).length : 0,
                    dnc: +contact.dnc,
                };

            }

            // Create an associative array to store the numbers of each contact
            if (!associative_array.value[contact.id]) {
                associative_array.value[contact.id] = [];
                indeterminate_contacts.value[contact.id] = false;
            }
    
            if (!associative_array.value[contact.id].includes(contact.number_id)) {
                associative_array.value[contact.id].push(contact.number_id);
            }

            return acc;
        }, {});

        numbers_ids.value = Object.values(associative_array.value).flat();
        return Object.values(groupedContacts);
    });

    // Reset checkboxes and expanded row
    const reset_selected_contacts = () => {
        all_selected.value = false;
        selected_contacts.value = [];
        selected_numbers.value = [];
        expandedRows.value = {};
        Object.keys(indeterminate_contacts.value).forEach((key) => indeterminate_contacts.value[key] = false);
        indeterminate_all.value = false;
    }

    // Handle pagination
    const onPageChange = (event: any) => {
        page.value = event.page + 1
        reset_selected_contacts()
    }

    // When the expand button is clicked, it expands the row and shows the contact numbers and its data
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

    const hide_contact_data = (id: number) => (id === formatted_contact.value[0]?.id) && expandedRows.value[id];

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
        if(custom_groups.value.length) {
            return custom_groups.value.map((group: CustomGroup) => group.id).slice(0, 2)
        }
    })

    const hardcoded_contact_data = computed(() => {
        const contact = contacts_data.value.contacts.find((c: any) => c.number_groups !== "0" && c.number_groups !== null && c.number_groups?.length < 5)
        if(contact) return { number_id: contact.number_id, group_id: contact.number_groups };
        else return null;
    })

    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const message_text = ref('');
    const confirm_modal = (data_to_send: SendNumberToTrash) => {
        const many_numbers = data_to_send.number_ids.length > 1;
        message_text.value = many_numbers ? 'Are you sure you want to send these numbers to Trash?'
                                          : 'Are you sure you want to send this number to Trash?';

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
                sendNumberToTrash(data_to_send, {
                    onSuccess: (response: { result: true } | APIResponseError) => {
                        if(response.result) {
                            reset_selected_contacts();
                            show_success_toast('Success!', many_numbers ? 'Numbers removed!' : 'Number removed!')
                        } else {
                            show_error_toast('Oops...', 'Something went wrong...')
                        }
                    },
                    onError: () => show_error_toast('Oops...', 'Something went wrong...')
                })
            }
        });
    };

    /* ----- Group actions ----- */
    const disabled_groups_action_btn = computed(() => selected_contacts.value.length === 0 && selected_numbers.value.length === 0);

    const handle_group_action = (action: 'add' | 'move' | 'trash') => {
        const numbers_id: { number_id: string }[] = selected_numbers.value.map((n_id: string) => ({ number_id: n_id }));

        if(action === 'move') {
            //TODO: Add functionality to move numbers to a group, need to work with the contact number groups
            console.log('currently not working D:')
            return
            const data_to_send: MoveNumberToGroup = {
                number_id: [{ number_id: hardcoded_contact_data?.value?.number_id }],
                groups: target_groups?.value,
                current_group_id: hardcoded_contact_data?.value?.group_id
            }

            moveNumberToGroup(data_to_send)
        } else if(action === 'add') {
            const data_to_send: AddNumberToGroup = {
                number_id: numbers_id,
                groups: target_groups?.value
            }

            addNumberToGroup(data_to_send)
        } else {
            const data_to_send: SendNumberToTrash = {
                number_ids: numbers_id.map((number) => number.number_id)
            }

            confirm_modal(data_to_send)
        }
    }

    // It's used in the tooltip
    const get_number_group_name = (groups: string[]) => {
        let groups_names: StringOrNumber[] = [];

        if(custom_groups.value.length) {
            groups_names = groups.map((group_id: string) => {
                const group = custom_groups.value.find((g: CustomGroup) => g.id === group_id);
                return group?.group_name ? group.group_name : group_id;
            });
        }

        return groups_names.length > 0 ? groups_names : groups;
    }


    const download_contacts = () => {
        download();
    };

    /* ----- Here we handle the all the checkboxes in the table ----- */
    const all_selected = ref(false);
    const selected_contacts = ref<string[]>([]);
    const selected_numbers = ref<string[]>([]);

    // To select all contacts
    const handle_select_all = () => {
        selected_contacts.value = all_selected.value ? formatted_contacts.value.map((contact: ContactRow) =>  {
            indeterminate_contacts.value[contact.id] = false;
            return contact.id
        }) : [];
        selected_numbers.value = all_selected.value ? formatted_contacts.value.reduce((acc: string[], contact: ContactRow) => {
            return acc.concat(associative_array.value[contact.id]);
        }, []) : [];
    }

    // Here we handle the checkboxes of every contact and its numbers
    const handle_select_checkbox = (contact_id: string, from_parent: boolean) => {
        if(from_parent) { // Contact checkbox
            const is_selected = selected_contacts.value.includes(contact_id);
            const is_expanded = Object.keys(expandedRows.value)[0] === contact_id;
            indeterminate_contacts.value[contact_id] = false;

            associative_array.value[contact_id].forEach((number_id: string) => {
                if(selected_contacts.value.includes(contact_id)) {
                    if(!selected_numbers.value.includes(number_id)) {
                        selected_numbers.value.push(number_id);
                    }
                } else {
                    selected_numbers.value = selected_numbers.value.filter((n_id: string) => n_id !== number_id);
                }
            });
            
            if (!(is_selected && is_expanded)) { // Handle the row expansion
                if (is_selected || is_expanded) {
                    toggleRow(contact_id);
                }
            }
        } else { // Number checkbox
            const is_some_selected = associative_array.value[contact_id].some((n_id: string) => selected_numbers.value.includes(n_id))
            const is_all_selected = associative_array.value[contact_id].every((n_id: string) => selected_numbers.value.includes(n_id))
            indeterminate_contacts.value[contact_id] = is_some_selected && !is_all_selected;

            if(is_all_selected || is_some_selected) {
                if(!selected_contacts.value.includes(contact_id)) {
                    selected_contacts.value.push(contact_id);
                }
            } else {
                selected_contacts.value = selected_contacts.value.filter((c_id: string) => c_id !== contact_id);
            }
        }
        
        all_selected.value = selected_contacts.value.length + selected_numbers.value.length == formatted_contacts.value.length + numbers_ids.value.length;
        if(all_selected.value) {
            indeterminate_all.value = false;
        } else {
            //TODO: indeterminate is not always being displayed, but this is workin good
            indeterminate_all.value = selected_contacts.value.length > 0 || selected_numbers.value.length > 0;
        }
    }

    // When a row is clicked, it expands
    const onRowSelect = (event: any) => {
        toggleRow(event.data.id)
    };

    const rowClass = (data: ContactRow) => {
        return [{ '!bg-[#E9DDFF]': selected_contacts.value.includes(data.id) }];
    };

    const action_button_style = 'bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-gray-100 hover:shadow-lg border-none';

    /* ----- Filters ----- */
    const ALL = computed(() => ({ name: 'All', count: contacts_data.value?.total_numbers }));
    const FILTERS_SYSTEM_GROUPS = computed<FilterOption[]>(() => {
        if(!system_groups.value) return []
        return [
            { id: '1', name: 'Unassigned', count: system_groups.value?.unassigned ?? 0 },
            { id: '2', name: 'Trash', count: system_groups.value?.trash ?? 0 },
            { id: '3', name: 'DNC', count: props.dncTotalNumbers ?? 0 }
        ]
    })
    const FILTERS_CUSTOM_GROUPS = computed(() => custom_groups.value.map((group: CustomGroup) => ({ id: group.id, name: group.group_name, count: group.count })))

    const filters = ref<string[]>([]);

    const handleUpdateFilters = (filters: string[]) => {
        console.log(filters);
    }
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
        &:nth-child(even) {
            background-color: rgba(121, 116, 126, 0.08);
        }

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

        tr {
            background-color: #F3EDF7;

            &:hover {
                background-color: #ebe5f7;
            }
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