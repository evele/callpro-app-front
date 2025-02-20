<template>
    <div class="w-full table-container rounded-2xl py-5 px-4 text-sm bg-white relative">
        <DataTable 
            :value="formatted_contacts"
            scrollable 
            :scrollHeight="table_height.toString()+'px'"
            class="table m-auto w-full h-full" 
            :paginator="show_pagination" 
            :rows="show" 
            dataKey="id"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            lazy
            :totalRecords="total_records"
            :first="(page - 1) * 10"
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
                            <InputText class="py-2 w-full" placeholder="Search by Name or Phone" v-model="search" />
                        </IconField>

                        <div class="flex gap-4">
                            <FilterDropdown ref="filterDropdownRef" :filters-system="FILTERS_SYSTEM_GROUPS" :filters-custom="FILTERS_CUSTOM_GROUPS" @update:filters="handleUpdateFilters" />
                            <Button :class="action_button_style">
                                <SortBySVG class="text-[#757575]" />
                                <span class="font-semibold">Sort by</span>
                            </Button>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center w-full">
                        <div v-if="!updatedSelectedGroupsID.includes(TRASH)" class="flex items-center gap-2 relative">
                            <Button @click="handle_group_action('add')" class="rounded-md bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white" :disabled="disabled_groups_action_btn">
                                <ProgressSpinner v-if="ATGIsPending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Adding number" />
                                <PlusRoundedSVG v-else class="w-5 h-5" />
                                <span class="text-sm font-bold tracking-wider leading-none pt-[2px]">{{ ATGIsPending ? 'Adding...' : 'Add to Group'}}</span>
                            </Button>

                            <Button @click="handle_group_action('move')" class="rounded-md bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white" :disabled="disabled_move_to_group_btn">
                                <ProgressSpinner v-if="MTGIsPending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Moving number" />
                                <MoveSVG v-else class="w-5 h-5" />
                                <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ MTGIsPending ? 'Moving...' : 'Move to Group' }}</span>
                            </Button>

                            <Button @click="handle_group_action('trash')" class="rounded-md bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white" :disabled="disabled_groups_action_btn">
                                <ProgressSpinner v-if="STTIsPending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Moving number" />
                                <TrashSVG v-else class="w-5 h-5" />
                                <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ STTIsPending ? 'Sending...' : 'Send to Trash' }}</span>
                            </Button>
                            <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 6px" class="absolute w-full -bottom-4 left-0"></ProgressBar>
                        </div>

                        <div class="flex items-center gap-4 ml-auto">
                            <label for="my-select" class="text-base font-medium text-black">Show</label>
                            <Select 
                                id="my-select"
                                v-model="show" 
                                :options="items_per_page_options" 
                                optionLabel="name" 
                                optionValue="code" 
                                class="min-w-[70px] rounded-md" 
                                placeholder="Select" 
                            />
                        </div>
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
                        <span @click.stop="handle_select_by_name(slotProps.data.id, true)">{{ slotProps.data.name }}</span>
                        <div v-show="Object.keys(expandedRows) == slotProps.data.id" class="absolute -top-[2px] -right-20 flex gap-2">
                            <Button class="bg-gray-200 py-[2px] px-[6px] border-none text-black hover:bg-[#9884cf] hover:text-white" 
                                @click="handle_edit_contact(slotProps.data.id)"
                            >
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
                            class="absolute -right-3 top-3 bg-[#49454F] text-white text-[10px] py-[1px] px-2 rounded-xl font-medium"> 
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
                            <span class="text-[#1D1B20] pl-4" @click.stop="handle_select_by_number(slotProps.data.number_id, slotProps.data.id, false)">
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
                            <div class="flex justify-center gap-1 items-center">
                                <p v-if="slotProps.data.group.length > 0" 
                                    class="rounded-xl bg-[#EBFFEE] text-xs font-semibold text-[#49454F] px-2 pt-[2px] pb-[3px] relative"
                                >
                                    {{ get_number_group_name([slotProps.data?.group[0]])[0] }}
                                    <span v-if="slotProps.data.group.length > 1"
                                        v-tooltip.top="{
                                            value: get_number_group_name(slotProps.data.group.slice(1)).join(', '),
                                            pt: { text: 'text-sm font-light', root: 'max-w-[400px]'}
                                        }"
                                        class="absolute -right-7 bg-[#49454F] text-white px-2 rounded-xl font-medium leading-none h-4"> 
                                        ...
                                    </span>
                                </p>
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

        <Button v-show="!formatted_contacts.length" type="button" class="absolute bottom-6 left-6"  
            :class="action_button_style" @click="emit('uploadFile', 'upload')"
        >
            <UploadSVG class="w-5 h-5 text-[#757575]" />
            <span class="font-semibold">Upload file</span>
        </Button>

    </div>
    <ConfirmationModal ref="confirmationModal" :title="confirmation_title" :is-disabled="false" @confirm="handle_confirm_modal" @cancel="handle_cancel_modal">
        <p v-if="current_action === 'trash'" class="text-lg font-semibold">{{ message_text }}</p>
        <div v-if="current_action === 'add' || current_action === 'move'" class="flex flex-col gap-4">
            <p class="text-lg font-semibold">{{ message_text }}</p>
            <MultiSelect v-model="target_groups_ui" :options="custom_groups_options" optionLabel="name" 
                display="chip" class="w-full mx-auto" placeholder="Choose many..." :maxSelectedLabels="4" 
            />
            <Message v-if="current_action === 'move'" severity="error" class="mb-1"><span class="font-bold">Warning:</span> This action will replace the current group of this numbers with the selected ones!</Message>
        </div>
    </ConfirmationModal>
</template>

<script setup lang="ts">
  
    const { width, height } = useWindowSize() // TODO: maybe exported in a composable?
    const table_height = computed(()=> Math.max(height.value - 402, 492))
    
    const props = withDefaults(defineProps<{
        selectedGroups: ContactSelectedGroup[]
        isCustomGroup: boolean
        dncTotalNumbers: number | null
        systemGroups: SystemGroup | null
        customGroups: CustomGroup[]
    }>(), {
        selectedGroups: (): ContactSelectedGroup[] => [],
    }

    const updatedSelectedGroups = computed(() => props.selectedGroups)
    const updatedSelectedGroupsID = computed(() => props.selectedGroups.map((group: ContactSelectedGroup) => group.group_id))
    const page = ref(1)    
    const show = ref(10)
    const with_groups = ref(true)
    const is_custom_group = computed(() => props.isCustomGroup)
    const search = useDebouncedRef("", 500)
    const total_records = ref()

    const expandedRows = ref<{ [key: string]: boolean }>({});
    const formatted_contact: Ref<FormattedContact[]> = ref([]);
    const associative_array = ref<{ [key: string]: string[] }>({})
    const indeterminate_all = ref(false);
    const indeterminate_contacts = ref<{ [key: string]: boolean }>({});
    const numbers_ids = ref<string[]>([])

    const emit = defineEmits(['uploadFile', 'update:filters', 'update:contactToEdit'])
    const filterDropdownRef = ref()

    const query_params = computed<AllContactsQueryParams>(() => ({
        page: page.value,
        show: show.value,
        with_groups: with_groups.value,
        is_custom_group: is_custom_group.value,
        group_id: updatedSelectedGroupsID.value,
        filter: search.value
    }))

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

    const { data: all_contacts_data, isLoading } = useFetchAllContacts(query_params) 
    const { mutate: sendNumberToTrash, isPending: STTIsPending } = useSendNumberToTrash()
    const { mutate: moveNumberToGroup, isPending: MTGIsPending } = useMoveNumberToGroup()
    const { mutate: addNumberToGroup, isPending: ATGIsPending } = useAddNumberToGroup()
    const { refetch: download } = useFetchDownloadContacts(updatedSelectedGroupsID, false)

    const contacts_data = computed(() => {
        if(!all_contacts_data?.value?.result) return { contacts: [], total_numbers: 0 }
        return all_contacts_data?.value
    })

    const custom_groups = computed(() => props.customGroups)

    const system_groups = computed<SystemGroup | null>(() => props.systemGroups)

    const show_pagination = computed(() => contacts_data.value.contacts.length ? true : false);

    const items_per_page_options = [
        { name: '10', code: 10 },
        { name: '25', code: 25 },
        { name: '50', code: 50 },
        { name: '100', code: 100 },
        { name: 'All', code: 100000 },
    ]

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
    const reset_selected_contacts = (reset_page: boolean = true, reset_search: boolean = true, reset_show: boolean = true) => {
        if(reset_page) {
            page.value = 1;
        }
        if(reset_search) {
            search.value = '';
        }
        if(reset_show) {
            show.value = 10;
        }

        all_selected.value = false;
        selected_contacts.value = [];
        selected_numbers.value = [];
        expandedRows.value = {};
        Object.keys(indeterminate_contacts.value).forEach((key) => indeterminate_contacts.value[key] = false);
        indeterminate_all.value = false;
        filterDropdownRef.value.reset_selected_filters()
    }

    // Handle pagination
    const onPageChange = (event: any) => {
        page.value = event.page + 1
        reset_selected_contacts(false, false, false)
    }

    watch(() => search.value, () => {
        page.value = 1;
    })

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

    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    /* ----- Trash and Groups actions ----- */
    const target_groups_ui = ref<SelectOption[]>([])
    const confirmationModal = ref()
    const disabled_groups_action_btn = computed(() => selected_contacts.value.length === 0 && selected_numbers.value.length === 0);
    const disabled_move_to_group_btn = computed(() => (selected_contacts.value.length === 0 && selected_numbers.value.length === 0) || updatedSelectedGroupsID.value.length > 1);
    const confirmation_title = ref('')
    const message_text = ref('');

    type CurrentAction = 'add' | 'move' | 'trash' | ''
    const current_action = ref<CurrentAction>('')

    type SelectedNumberIds = { number_id: string }[]

    const custom_groups_options = computed(() => {
        if (custom_groups.value?.length) {
            return custom_groups.value.filter((group: CustomGroup) => updatedSelectedGroupsID.value.includes(group.id) ? null : group).map((group: CustomGroup) => {
                return {
                    name: group.group_name,
                    code: group.id
                }
            })
        }
        return []
    })

    const reset_confirmation_modal_state = () => {
        current_action.value = ''
        target_groups_ui.value = []
    }

    const handle_group_action = (action: CurrentAction) => {
        if(action === 'add') {
            current_action.value = 'add'
            confirmation_title.value = 'Add to group'
            message_text.value = 'Are you sure you want to add the numbers to this group(s)?'
        } else if(action === 'move') {
            current_action.value = 'move'
            confirmation_title.value = 'Move to group'
            message_text.value = 'Are you sure you want to move the numbers to this group(s)?'
        } else {
            current_action.value = 'trash'
            confirmation_title.value = 'Confirmation'

            const many_numbers = selected_numbers.value.length > 1;
            message_text.value = many_numbers ? 'Are you sure you want to send these numbers to Trash?'
                                              : 'Are you sure you want to send this number to Trash?';
        }
        confirmationModal.value?.open()
    }

    const handle_confirm_modal = () => {
        const numbers_id: { number_id: string }[] = selected_numbers.value.map((n_id: string) => ({ number_id: n_id }));

        switch(current_action.value) {
            case 'add':
                handle_add_to_group(numbers_id)
                break;
            case 'move':
                handle_move_to_group(numbers_id)
                break;
            case 'trash':
                handle_send_to_trash(numbers_id)
                break;
            default:
                break;
        }  
    };

    const handle_cancel_modal = () => {
        reset_confirmation_modal_state()
    }

    const handle_add_to_group = (numbers_id: SelectedNumberIds) => {
        const formatted_target_groups = target_groups_ui.value.map((group: SelectOption) => group.code)
        if(formatted_target_groups.length === 0) {
            show_error_toast('Invalid', 'Please select at least one group...')
            return;
        }

        const data_to_send: AddNumberToGroup = {
            number_id: numbers_id,
            groups: formatted_target_groups,
        }

        addNumberToGroup(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    reset_selected_contacts(true, true, false)
                    show_success_toast('Success!', 'Numbers added!')
                } else {
                    show_error_toast('Error', 'Something failed while adding numbers...')
                }
            },
            onError: () => show_error_toast('Error', 'Something failed while adding numbers...')
        })
        reset_confirmation_modal_state()
    }

    const handle_move_to_group = (numbers_id: SelectedNumberIds) => {
        const formatted_target_groups = target_groups_ui.value.map((group: SelectOption) => group.code)
        if(formatted_target_groups.length === 0) {
            show_error_toast('Invalid', 'Please select at least one group...')
            return;
        }
        
        const data_to_send: MoveNumberToGroup = {
            number_id: numbers_id,
            groups: formatted_target_groups,
            current_group_id: updatedSelectedGroupsID.value[0]
        }

        moveNumberToGroup(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    reset_selected_contacts(true, true, false)
                    show_success_toast('Success!', 'Numbers moved!')
                } else {
                    show_error_toast('Oops...', 'Something failed while moving numbers...')
                }
            },
            onError: () => show_error_toast('Oops...', 'Something failed while moving numbers...')
        })
        reset_confirmation_modal_state()
    }

    const handle_send_to_trash = (numbers_id: SelectedNumberIds) => {
        const data_to_send: SendNumberToTrash = {
            number_ids: numbers_id.map((number) => number.number_id)
        }

        sendNumberToTrash(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    reset_selected_contacts(true, true, false);
                    show_success_toast('Success!', data_to_send.number_ids.length > 1 ? 'Numbers removed!' : 'Number removed!')
                } else {
                    show_error_toast('Oops...', 'Something went wrong...')
                }
            },
            onError: () => show_error_toast('Oops...', 'Something went wrong...')
        })
        current_action.value = ''
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

    const handle_select_by_name = (contact_id: string, from_parent: boolean) => {
        if(selected_contacts.value.includes(contact_id)) {
            selected_contacts.value = selected_contacts.value.filter((c_id: string) => c_id !== contact_id);
        } else {
            selected_contacts.value.push(contact_id);
        }
        handle_select_checkbox(contact_id, from_parent);
    }

    const handle_select_by_number = (number_id: string, contact_id: string, from_parent: boolean) => {
        if(selected_numbers.value.includes(number_id)) {
            selected_numbers.value = selected_numbers.value.filter((n_id: string) => n_id !== number_id);
        } else {
            selected_numbers.value.push(number_id);
        }
        handle_select_checkbox(contact_id, from_parent);
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

    defineExpose({ reset_selected_contacts })

    const action_button_style = 'bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-gray-100 hover:shadow-lg border-none';

    /* ----- Edit Contact Section ----- */
    const handle_edit_contact = (contact_id: number) => {
        const contact_with_numbers = contacts_data.value.contacts.filter((contact: ContactPhoneNumber) => contact.id == contact_id)
        const contact_to_edit = contact_with_numbers.reduce((acc: any, contact: ContactPhoneNumber) => {
            acc.id = contact.id
            acc.first_name = contact.first_name
            acc.last_name = contact.last_name
            acc.numbers.push({
                id: contact.number_id,
                number: contact.number,
                notes: contact.notes,
                type: contact.type,
                number_groups: contact.number_groups
            })
            return acc
        }, { first_name: '', last_name: '', numbers: [] })

        emit('update:contactToEdit', contact_to_edit)
    }

    /* ----- Filters ----- */
    const FILTERS_SYSTEM_GROUPS = computed<FilterOption[]>(() => {
        if(!system_groups.value) return []
        return [
            { id: CONTACTS_ALL, name: 'All', count: system_groups.value?.not_trash ?? 0 },
            { id: UNASSIGNED, name: 'Unassigned', count: system_groups.value?.unassigned ?? 0 },
            { id: TRASH, name: 'Trash', count: system_groups.value?.trash ?? 0 }
        ].filter((group: FilterOption) => group.id !== updatedSelectedGroupsID.value[0])
    })

    const FILTERS_CUSTOM_GROUPS = computed(() => {
        return custom_groups.value.filter((group: CustomGroup) => group.id !== updatedSelectedGroupsID.value[0]).map((group: CustomGroup) => ({ id: group.id, name: group.group_name, count: group.count }))
    })

    const handleUpdateFilters = (selected_filters: string[]) => {
        const all_filters = [...FILTERS_SYSTEM_GROUPS.value, ...FILTERS_CUSTOM_GROUPS.value];

        const selected_filters_formatted = selected_filters.map((filter_id: string) => {
            const current_filter = all_filters.find((filter: FilterOption) => filter.id === filter_id);
            if(current_filter) {
                return {
                    group_name: current_filter.name,
                    group_id: current_filter.id,
                    is_custom: !SYSTEM_GROUPS.includes(current_filter.id)
                }
            }
        })
        // Emit the selected groups to the parent component, and in the first position we always have the selected group
        emit('update:filters', [updatedSelectedGroups.value[0], ...selected_filters_formatted]);
    }
</script>

<style scoped lang="scss">
::v-deep(.table) {
    .p-datatable-table {
        border-collapse: collapse;
        width: 100%;
        position: relative;
    }
    padding-bottom: 65px;

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
        position: absolute;
        bottom: 0;
        width: 100%;

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
    }
</style>