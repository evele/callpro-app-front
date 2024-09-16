<template>
    <div class="w-full table-container rounded-7 py-4 pl-4 px-2">
        <DataTable 
            :value="formatted_contacts" 
            tableStyle="min-width: 40rem" 
            class="contacts-table w-full flex flex-col gap-18" 
            :paginator="show_pagination" 
            :rows="10" 
            dataKey="id"
            paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
            lazy
            :loading="isLoading"
            :totalRecords="total_records"
            @page="onPageChange($event)"
            v-model:expandedRowGroups="expandedRowGroups"
            expandableRowGroups 
            rowGroupMode="subheader" 
            groupRowsBy="id"
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

            <template #groupheader="slotProps">
                <button @click="console.log(slotProps.data)">{{ slotProps.data.name }}</button>
                <Button class="expand-btn" @click="toggleRow(slotProps.data.id)">
                        <template #icon>
                            <ChevronUpSVG v-if="isRowExpanded(slotProps.data.id)" class="chevron-icon" />
                            <ChevronDownSVG v-else class="chevron-icon" />
                        </template>
                    </Button>
            </template>

            <Column selectionMode="multiple" headerStyle="text-align: left"></Column>

            <Column field="name" header="Name" class="left-aligned-column">
                <template #body="slotProps">
                    <span class="name-item">{{ slotProps.data.name }}</span>
                </template>
            </Column>

            <Column field="number" header="Phone" class="center-aligned-column">
                <template #body="slotProps">
                    <span class="phone-item">{{ slotProps.data.numbers[0].number }}</span>
                </template>
            </Column>

            <Column field="groups" header="Groups" class="center-aligned-column">
                <template #body="slotProps">
                    <span class="font-bold">{{ slotProps.data.numbers[0].group }}</span>
                </template>
            </Column>

            <Column field="dnc" header="DNC" class="center-aligned-column">
                <template #body="slotProps">
                    <DncSVG v-if="slotProps.data.numbers[0].dnc === '1'" class="dnc-icon w-full" />
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
    const props = defineProps({
        selectedTab: { type: String, required: true }
    })

    const page = ref(1)    
    const show = ref(10)
    const with_groups = ref(true)
    const is_custom_group = ref(false)
    const search = ref("")
    const total_records = ref()

    const expandedRowGroups = ref([]);

    const { data: all_contacts_data, error, isLoading,isSuccess, isError, refetch } = useFetchAllContacts(page,show,with_groups,is_custom_group,props.selectedTab,search) 
    
    const show_pagination = computed(() => all_contacts_data?.value?.contacts?.length ? true : false);

    const formatted_contacts = computed(() => {
        total_records.value = all_contacts_data?.value?.total_numbers;
        return all_contacts_data?.value?.contacts?.map((contact: ContactPhoneNumber) => {
            return {
                id: contact.id,
                name: show_full_name(contact.first_name, contact.last_name),
                number: format_number_to_show(contact.number),
                group: contact.number_groups === null ? '0' : typeof contact.number_groups === "string" ? contact.number_groups.trim().split(/\s*,\s*/).length : '0',
                dnc: contact.dnc == '1' ? 'Yes' : 'No'
            }
        })
    }, {});

    const onPageChange = (event: any) => {
        page.value = event.page + 1
    }

    const toggleRow = (id: string) => {
        if(Object.keys(expandedRowGroups.value)[0] === id) {
            expandedRowGroups.value = [];
            return
        }
        
        if (expandedRowGroups.value.length) {
            expandedRowGroups.value = [];
            if(id) expandedRowGroups.value[id] = true;
            return
        }
        expandedRowGroups.value[id] = true;
    }

    const isRowExpanded = (id: string) => !!expandedRowGroups.value[id];
</script>

<style scoped lang="scss">
    .table-container {
        max-width: 850px;
        max-height: 780px;
        background-color: white;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        font-size: 14px;
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
</style>