<template>
    <div class="w-full table-container rounded-7 py-5 px-4">
        <DataTable 
            :value="formatted_contacts"
            scrollable 
            tableStyle="min-width: 50rem"
            class="table w-full flex flex-col gap-18" 
            :paginator="show_pagination" 
            :rows="10" 
            dataKey="id"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            lazy
            :loading="isLoading"
            :totalRecords="total_records"
            @page="onPageChange($event)"
            v-model:expandedRows="expandedRows"
        >

            <template #header>
                <header class="flex flex-col w-full gap-18">
                    <div class="flex justify-between items-center w-full">
                        <div class="search-input-container">
                            <SearchSVG class="search-icon" />
                            <InputText type="text" placeholder="Search by Name, Phone or Group" class="search-input rounded-8" />
                        </div>

                        <div class="flex gap-4">
                            <Button class="table-action-btn flex items-center py-2 px-3 rounded-9 gap-6" label="Filter">
                                <template #icon>
                                    <FilterSVG class="table-action-icon" />
                                </template>
                            </Button>
                            <Button class="table-action-btn flex items-center py-2 px-3 rounded-9 gap-6" label="Sort by">
                                <template #icon>
                                    <SortBySVG class="table-action-icon" />
                                </template>
                            </Button>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-6 selected-group-info rounded-4">
                        <CheckSVG class="check-icon rounded-full" />
                        <span>All</span>
                    </div>
                </header>
            </template>

            <Column selectionMode="multiple" headerStyle="text-align: left"></Column>

            <Column field="name" header="Name" class="left-aligned-column">
                <template #body="slotProps">
                    <span class="name-item">{{ slotProps.data.name }}</span>
                </template>
            </Column>

            <Column field="number" header="Phone" class="center-aligned-column">
                <template #body="slotProps">
                    <div class="phone-data-container h-row">
                        <span class="phone-item">{{ slotProps.data.number }}</span>
                        <span v-if="slotProps.data.total_numbers > 1" class="extra-number-chip"> +{{ slotProps.data.total_numbers -1 }}</span>
                    </div>
                </template>
            </Column>

            <Column field="groups" header="Groups" class="center-aligned-column">
                <template #body="slotProps">
                    <span class="font-bold">{{ slotProps.data.total_groups }}</span>
                </template>
            </Column>

            <Column field="dnc" header="" class="center-aligned-column">
                <template #header>
                    <div class="dnc-header-container">
                        <span>DNC</span>
                        <ErrorIconSVG />
                    </div>
                </template>
                <template #body="slotProps">
                    <DncSVG v-if="slotProps.data.dnc === '1'" class="dnc-icon w-full" />
                    <PhoneSVG v-else class="w-full" />
                </template>
            </Column>

            <Column expander>
                <template #body="slotProps">
                    <Button class="expand-btn" @click="toggleRow(slotProps.data.id)">
                        <template #icon>
                            <ChevronUpSVG v-if="isRowExpanded(slotProps.data.id)" class="chevron-icon" />
                            <ChevronDownSVG v-else class="chevron-icon" />
                        </template>
                    </Button>
                </template>
            </Column>


            <template #expansion>
                <DataTable 
                    :value="formatted_contact"
                    tableStyle="min-width: 35rem"
                    class="contacts-expanded-row w-full"
                >
                    <Column selectionMode="multiple" headerStyle="text-align: left"></Column>
                    <Column field="name" header="" class="left-aligned-column" style="width: 35%;">
                        <template #body="slotProps">
                            <span class="name-item">
                                {{ format_contact_type(slotProps.data.type) }}
                            </span>
                        </template>
                    </Column>

                    <Column field="number" header="" class="center-aligned-column" style="width: 20%;">
                        <template #body="slotProps">
                            <span class="phone-item">
                                {{ slotProps.data.number }}
                            </span>
                        </template>
                    </Column>

                    <Column field="groups" header="" class="center-aligned-column" style="width: 25%; padding-left: 0;">
                        <template #body="slotProps">
                            <div class="group-container">
                                <span class="rounded-4 group-chip" v-for="(group, g_i) in slotProps.data.group" :key="g_i">Group {{ g_i + 1 }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="dnc" header="" class="center-aligned-column" style="width: 9%; padding-left: 12px;">
                        <template #body="slotProps">
                            <span>
                                <DncSVG v-if="slotProps.data.dnc === '1'" class="dnc-icon" />
                                <PhoneSVG v-else />
                            </span>
                        </template>
                    </Column>

                    <Column field="empty" header="" class="center-aligned-column" style="width: 12%;">
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
                    <Button type="button" label="Upload file" class="table-action-btn flex items-center py-2 px-3 rounded-9 gap-6">
                        <template #icon>
                            <UploadSVG class="upload-icon" />
                        </template>
                    </Button>

                    <Button type="button" label="Download list" class="table-action-btn flex items-center py-2 px-3 rounded-9 gap-6">
                        <template #icon>
                            <DownloadSVG />
                        </template>
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

    type FormattedContact = {
        dnc: ZeroOrOne,
        group: string[],
        number: string,
        type: OneToFour
    }

    const { data: all_contacts_data, error, isLoading,isSuccess, isError, refetch } = useFetchAllContacts(page,show,with_groups,is_custom_group,props.selectedTab,search) 
    
    const contacts_data = computed(() => {
        if(!all_contacts_data?.value?.result) return { contacts: [], total_numbers: 0 }
        return all_contacts_data?.value
    })

    const show_pagination = computed(() => contacts_data.value.contacts.length ? true : false);

    const formatted_contacts = computed(() => {
        total_records.value = contacts_data.value.total_numbers;
        if(!contacts_data.value.contacts) return []

        const groupedContacts = contacts_data.value?.contacts?.reduce((acc: any, contact: ContactPhoneNumber) => {
            if (acc[contact.id]) {
                acc[contact.id].total_numbers += 1;
                if(typeof contact.number_groups === 'string') {
                    acc[contact.id].total_groups += get_number_groups(contact.number_groups).length;
                }
            } else {
                acc[contact.id] = {
                    id: contact.id,
                    name: show_full_name(contact.first_name, contact.last_name),
                    number: format_number_to_show(contact.number),
                    total_numbers: 1,
                    total_groups: typeof contact.number_groups === 'string' ? get_number_groups(contact.number_groups).length : '0',
                    dnc: contact.dnc
                };
            }

            return acc;
        }, {});

        return Object.values(groupedContacts);
    });

    const onPageChange = (event: any) => {
        page.value = event.page + 1
    }

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

    const format_expanded_contact = (id: string | number) => {
        if(!contacts_data.value?.contacts) return [];

        formatted_contact.value = contacts_data.value.contacts
                            ?.filter((contact: ContactPhoneNumber) => contact.id === id)
                            .map((contact: ContactPhoneNumber) => {
                                return {
                                    type: contact.type,
                                    number: format_number_to_show(contact.number),
                                    group: typeof contact.number_groups === 'string' ? get_number_groups(contact.number_groups) : [],
                                    dnc: contact.dnc
                                }
                            })
    }

    const isRowExpanded = (id: string) => !!expandedRows.value[id];

    const get_number_groups = (groups: string) => groups === null ? [] : groups.trim().split(/\s*,\s*/);
</script>

<style scoped lang="scss">
    .table-container {
        max-width: 700px;
        background-color: white;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        font-size: 14px;

        @media (min-width: 980px) {
            max-width: 800px;
        }
        @media (min-width: 1100px) {
            max-width: 850px;
        }
    }
    
    .table-action-btn {
        background-color: transparent;
        border: none;
        transition: background-color 0.3s;
        font-weight: 600;

        &:hover {
            cursor: pointer;
            background-color: #e6e2e2;
        }
    }

    .table-action-icon {
        color: #757575;
    }

    .search-input-container {
        position: relative;
        display: inline-block;
    }

    .search-icon {
        position: absolute;
        left: 10px; 
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
    }

    .search-input {
        border: 1px solid #DED8E1;
        padding: 2px 10px 2px 35px;
        width: 280px;
        height: 38px;
    }

    .selected-group-info {
        background-color: #e1daf0;
        padding: 4px 8px;
        border-bottom: 1px solid #ccc;
        width: fit-content;
        color: black;
    }

    .check-icon {
        background-color: #65558F;
        color: white;
        width: 16px;
        height: 16px;
        padding: 1px;
    }

    .upload-icon {
        width: 20px; 
        height: 20px;
    }

    .dnc-icon {
        color: #751617;
    }

    .font-bold {
        font-weight: 600;
    }

    .phone-item {
        color: #797676;
        letter-spacing: 0.117px;
    }

    .name-item {
        color: #1D1B20;
        letter-spacing: 0.117px;
    }

    .expand-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: none;
        height: 35px;
        width: 35px;

        &:hover {
            cursor: pointer;
        }
    }

    .chevron-icon {
        color: #302f31;
    }

    .phone-data-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .extra-number-chip {
            position: absolute;
            right: 2px;
            top: 25px;
            background-color: #49454F;
            color: #FFF;
            font-size: 10px;
            padding: 1.5px 7px;
            border-radius: 10px;
        }
    }
    
    .dnc-header-container {
        display: flex;
        justify-content: center;
        padding-left: 14px;
    }

    .group-container {
        display: flex;
        justify-content: center;
        gap: 5px;

        .group-chip {
            background-color: #EBFFEE;
            font-size: 12px;
            font-weight: 600;
            color: #49454F;
            padding: 2px 8px 3px 8px;
        }
    }

    .h-row {
        height: 68px;
    }
</style>