<template>
    <div>
        <ButtonsNumbersTable @update:action-selected="handle_btn_action" />

        <div class="flex items-center justify-between gap-4 mt-6">
            <div class="w-full">
                <IconField class="w-full max-w-[300px]">
                    <InputIcon>
                        <SearchSVG class="text-grey-secondary" />
                    </InputIcon>
                    <InputText class="py-2 w-full text-sm" placeholder="Search by Name, Phone" v-model="search" />
                </IconField>
            </div>

            <div class="flex items-center h-10 rounded-[4px] py-1 bg-light-primary w-auto min-w-64 text-white">
                <div class="border-r border-gray-300 w-1/2 flex items-center justify-center gap-2">
                    <p class="text-2xl font-black leading-none">{{ props?.monthlyNumbersData?.total_contacts || 0 }}</p>
                    <p class="text-sm font-light leading-none mt-[2px]">Contacts</p>
                </div>
                <div class="w-1/2 flex items-center justify-center gap-2">
                    <p class="text-2xl font-black leading-none">{{ props?.monthlyNumbersData?.total_numbers || 0 }}</p>
                    <p class="text-sm font-light leading-none mt-[2px]">Numbers</p>
                </div>
            </div>
        </div>

        <div class="flex-grow overflow-hidden mt-6">
            <ProgressBar v-if="props.isLoading" mode="indeterminate" style="height: 6px"></ProgressBar>
            <DataTable
                v-model:selection="selected_numbers" 
                :value="formatted_numbers_data" 
                scrollable
                scrollHeight="330px"
                dataKey="id" 
                class="selected-numbers-table"
                stripedRows
                :rowClass="rowClass"
                selectionMode="multiple"
                paginator
                :rows="show"
                :totalRecords="total_records"
                :first="(page - 1) * 10"
                @rowSelect="onRowSelect"
            >
                <Column :headerStyle="[{ width: '3rem' }, selected_header_style]">
                    <template #header>
                        <Checkbox v-model="all_selected" :binary="true" @change="handle_select_all" :indeterminate="indeterminate" />                                   
                    </template>

                    <template #body="slotProps">
                        <Checkbox v-model="selected_numbers" :inputId="slotProps.data.id" :value="slotProps.data" 
                            @click.stop @change="handle_select_checkbox(slotProps.data)" />                                  
                    </template>
                </Column>

                <Column field="name" header="Name" :headerStyle="selected_header_style">
                    <template #body="slotProps">
                        <span class="text-sm">{{ slotProps.data.name }}</span>
                    </template>
                </Column>

                <Column field="number" header="Phone" class="text-center min-w-[150px]" :headerStyle="selected_header_style">
                    <template #body="slotProps">
                        <span class="text-sm text-[#797676]">{{ format_number_to_show(slotProps.data.number) }}</span>
                    </template>
                </Column>

                <Column field="notes" header="Notes" class="text-center min-w-[150px]" :headerStyle="selected_header_style">
                    <template #body="slotProps">
                        <span class="text-sm text-black font-bold">{{ slotProps.data.notes }}</span>
                    </template>
                </Column>

                <Column field="dnc" header="" class="text-center" :headerStyle="selected_header_style">
                    <template #header>
                        <div class="flex justify-center pl-[14px] font-semibold">
                            <span>DNC</span>
                            <ErrorIconSVG />
                        </div>
                    </template>
                    <template #body="slotProps">
                        <PhoneSVG v-if="slotProps.data.dnc == 0" class="w-full" />
                        <DncSVG v-else class="w-full text-[#751617]" />
                    </template>
                </Column>

                <template #paginatorend>
                    <div class="flex items-center gap-4 ml-auto">
                        <label for="my-select" class="text-base font-medium text-black">Show</label>
                        <Select 
                            id="my-select"
                            v-model="show" 
                            :options="items_per_page_options" 
                            optionLabel="name" 
                            optionValue="code" 
                            class="min-w-[70px] rounded-md h-9" 
                            placeholder="Select" 
                        />
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        tableData: GetBSNResponse | [],
        monthlyNumbersData: TotalMonthlyNumbersData,
        isLoading: boolean,
    }>()

    const emit = defineEmits<{
        (event: 'update:action-selected', action: BroadcastNumbersBtnActions): void
    }>()

    const search = ref('')
    const show = ref(10)
    const page = ref(1)
    const total_records = computed(() => formatted_numbers_data.value.length)
    const selected_numbers = ref<FormattedNumbersData[] | []>([])
    const indeterminate = computed(() => selected_numbers.value.length > 0 && selected_numbers.value.length < formatted_numbers_data.value.length)
    const all_selected = ref(false)

    type FormattedNumbersData = {
        id: number,
        name: string,
        number: string,
        notes: number,
        dnc: number,
        selected: boolean
    }

    const formatted_numbers_data = computed<FormattedNumbersData[]>(() => {
        return props.tableData.numbers_data.map((data: BroadcastSelectedNumber) => {
            return {
                id: data.contacts_phone_numbers_id,
                name:  show_full_name(data.first_name, data.last_name),
                number: data.number,
                notes: 1,
                dnc: data.dnc,
                selected: data.selected == '1' ? true : false
            }
        })
    })

    onMounted(() => {
        selected_numbers.value = formatted_numbers_data.value.filter((data: FormattedNumbersData) => data.selected)
        all_selected.value = selected_numbers.value.length === formatted_numbers_data.value.length
    })

    const items_per_page_options = [
        { name: '5', code: 5 },
        { name: '10', code: 10 },
        { name: '25', code: 25 },
        { name: '50', code: 50 },
        { name: '100', code: 100 },
    ]

    const selected_header_style = computed(() => all_selected.value ? { backgroundColor: '#9A83DB', color: '#fff' } : {})
    const rowClass = (data: FormattedNumbersData) => {
        return [{ '!bg-[#E9DDFF]': selected_numbers.value.some((number: FormattedNumbersData) => number.number === data.number ) }];
    };

    const handle_btn_action = (action: BroadcastNumbersBtnActions) => {
        emit('update:action-selected', action)
    }

    /* ----- Handle selection ----- */
    const handle_select_all = () => {
        selected_numbers.value = all_selected.value ? formatted_numbers_data.value : []
    }
    
    const handle_select_checkbox = () => {
        all_selected.value = selected_numbers.value.length === formatted_numbers_data.value.length
    }

    const onRowSelect = () => {
        all_selected.value = selected_numbers.value.length === formatted_numbers_data.value.length
    }
</script>

<style scoped lang="scss">
:deep(.selected-numbers-table) {
    min-width: 30rem;
    padding-bottom: 40px;

    .p-datatable-thead, .p-datatable-header-cell {
        background-color: rgb(233, 231, 235);

        &:first-child {
            border-top-left-radius: 6px;
        }
        &:last-child {
            border-top-right-radius: 6px;
        }

        tr {
            font-size: 14px;
            font-weight: 500;
            th:nth-child(n+3) {
                .p-datatable-column-header-content {
                    display: flex;
                    justify-content: center;
                }
            }
        }

        
        th {
            padding-top: 9px;
            padding-bottom: 9px;
        }
    }

    td {
        height: 53px;
    }

    .p-datatable-paginator-bottom {
        border: none;
        position: absolute;
        bottom: -8px;
        width: 100%;

        .p-paginator-first, .p-paginator-prev, .p-paginator-page, .p-paginator-next, .p-paginator-last {
            background-color: transparent;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            transition: background-color 0.3s;
            height: 24px;
            width: 24px;
            min-width: 24px;

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
}
</style>