<template>
    <div class="w-full table-container rounded-7 py-4 pl-4 px-2">
        <div v-if="isLoading">Loading Contacts...</div>
        <DataTable v-else :value="formatted_contacts" tableStyle="min-width: 40rem" class="contacts-table w-full flex flex-col gap-18" 
            :paginator="show_pagination" :rows="10" dataKey="id"
            paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
            lazy
            :loading="isLoading"
            :totalRecords="total_records"
            @page="onPageChange($event)"
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
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                :class="{'left-aligned-column': col.field === 'name', 'center-aligned-column': col.field !== 'name'}"
            ></Column>

            <template #empty>
                <tr>
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
    const page = ref(1)    
    const show = ref(10)
    const with_groups = ref(true)
    const is_custom_group = ref(false)
    const search = ref("")
    const total_records = ref(16)
    
    const props = defineProps({
        selectedTab: { type: String, required: true }
    })

    const { data: all_contacts_data, error, isLoading,isSuccess, isError, refetch } = useFetchAllContacts(page,show,with_groups,is_custom_group,props.selectedTab,search) 

    const show_pagination = computed(() => all_contacts_data?.value?.contacts?.length ? true : false);

    const formatted_contacts = computed(() => {
        console.log(all_contacts_data.value)
        return all_contacts_data?.value?.contacts?.map((contact: ContactPhoneNumber) => {
            return {
                name: show_full_name(contact.first_name, contact.last_name),
                number: format_number_to_show(contact.number),
                group: contact.number_groups === null ? '0' : contact.number_groups.trim().split(/\s*,\s*/).length,
                dnc: contact.dnc == '1' ? 'Yes' : 'No'
            }
        })
    })

    const onPageChange = (event: any) => {
        page.value = event.page + 1
    }

    const columns = [
        { field: 'name', header: 'Name' },
        { field: 'number', header: 'Phone' },
        { field: 'group', header: 'Groups' },
        { field: 'dnc', header: 'DNC' },
    ];
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
    

    // .contacts-table td {
    //     text-align: center;
    //     vertical-align: middle;
    // }
</style>