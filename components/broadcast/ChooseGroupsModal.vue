<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-5 px-8">
                <h2 class="flex items-center gap-4 font-bold text-2xl text-black">Choose groups</h2>
                <Button @click="close" class="bg-transparent border-none text-black hover:bg-gray-200" :disabled="isPending"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <div class="w-full mt-2 mb-6">
            <IconField class="w-full max-w-[300px]">
                <InputIcon>
                    <SearchSVG class="text-grey-secondary" />
                </InputIcon>
                <InputText class="py-2 w-full text-sm" placeholder="Search by name" v-model="search" :disabled="isPending" />
            </IconField>
        </div>

        <div class="flex-grow overflow-hidden">
            <ProgressBar v-if="isFetching" mode="indeterminate" style="height: 6px"></ProgressBar>
            <DataTable
                v-model:selection="selected_groups" 
                :value="groups_data" 
                scrollable
                scrollHeight="calc(70vh - 250px)"
                dataKey="id" 
                class="groups-table"
                stripedRows
                :rowClass="rowClass"
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" :headerStyle="[{ width: '3rem' }, selected_header_style]"></Column>
                <Column field="group_name" header="Group Name" :headerStyle="selected_header_style">
                    <template #body="slotProps">
                        <span class="text-sm text-dark-2">{{ slotProps.data.group_name }}</span>
                    </template>
                </Column>
                <Column field="group_count" header="Numbers" class="text-center min-w-[150px]" :headerStyle="selected_header_style">
                    <template #body="slotProps">
                        <span class="text-sm font-semibold">{{ slotProps.data.group_count }}</span>
                    </template>
                </Column>
                <Column field="selected" header="Selected" class="text-center min-w-[150px]" :headerStyle="selected_header_style">
                    <template #body="slotProps">
                        <span class="text-sm font-semibold">{{ show_total_selected(slotProps.data) }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>

        <template #footer>
            <footer class="flex flex-col w-full justify-center gap-4 sm:gap-6 font-bold mt-7 sm:flex-row">
                <Button @click="close" class="bg-transparent border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]" :disabled="isPending">
                    Cancel
                </Button>
                <Button @click="handle_save" class="w-full sm:max-w-[300px]" :disabled="!selected_groups.length || isPending">
                    <ProgressSpinner v-show="isPending" class="w-5 h-5 light-spinner ml-0 mr-2" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Adding" />
                    {{ isPending ? 'Adding...' : 'Add' }}
                </Button>
            </footer>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const broadcastStore = useBroadcastStore()

    const { data: groupsData, isFetching } = useFetchGetAllContactsAndGroups()
    const { data: groupsNumbersSelected, isFetching: isFetchingGNS } = useFetchGetGroupNumbersSelected(broadcastStore.broadcast_id)
    const { mutate: saveGroups, isPending } = useSaveSelectedGroup()

    type UserGroupFormatted = Omit<UserGroup, 'id'> & { 
        id: number 
        selected_qty: number
        all_selected: boolean
        disable_checkbox: boolean
    };
    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const emit = defineEmits<{
        (event: 'update:data-loaded', value: boolean): void
    }>()

    const visible = ref(false)
    const search = ref('')
    const selected_groups = ref([])

    const groups_numbers_selected = computed(() => {
        if(!groupsNumbersSelected?.value?.result) return []
        return groupsNumbersSelected.value.groups_selected
    })

    const groups_data = computed(() => {
        if(!groupsData?.value?.result) return []

        const filtered_groups = groupsData.value.groups.filter((group: UserGroup) => group.id !== 'unassigned').map((group: UserGroup) => {
            return {
                ...group,
                selected_qty: 0,
                all_selected: false,
                disable_checkbox: false
            }
        })
        if(search.value) {
            return filtered_groups.filter((group: UserGroup) => group.group_name.toLowerCase().includes(search.value.toLowerCase()))
        }
        return filtered_groups
    })

    watch(
        () => ({ fetching_gt: isFetching.value, fetching_gns: isFetchingGNS.value }),
        ({ fetching_gt, fetching_gns }: { fetching_gt: boolean, fetching_gns: boolean}) => {
            if(!fetching_gt && !fetching_gns) emit('update:data-loaded', false)
        }
    );

    watch(
        () => ({ selected_numbers: groups_numbers_selected.value, is_visible: visible.value }),
        ({ selected_numbers, is_visible }: { selected_numbers: GroupSelected[], is_visible: boolean}) => {
            if(!is_visible) return
            groups_data.value.forEach((group: UserGroupFormatted) => {
                if(selected_numbers.length) {
                    group.selected_qty = selected_numbers.find((g: GroupSelected) => g.phone_number_group_id === group.id)?.numbers_selected || group.selected_qty
                    group.all_selected = group.selected_qty === group.group_count
                    group.disable_checkbox = group.all_selected
                }
                if(group.all_selected && selected_groups.value.every((g: UserGroupFormatted) => g.id !== group.id)) {
                    selected_groups.value.push(group)
                }
            });
            console.log(selected_groups.value)
        },
        { immediate: true }
    );

    // watchEffect(() => {
    //     groups_data.value.forEach((group: UserGroupFormatted) => {
    //         if(groups_numbers_selected.value.length) {
    //             group.selected_qty = groups_numbers_selected.value.find((g: GroupSelected) => g.phone_number_group_id === group.id)?.numbers_selected || group.selected_qty
    //             group.all_selected = group.selected_qty === group.group_count
    //             group.disable_checkbox = group.all_selected
    //         }
    //         if(group.all_selected) {
    //             selected_groups.value.push(group)
    //         }
    //         console.log('holaaa', selected_groups.value, groups_data.value)
    //     });
    // })

    const show_total_selected = (group: UserGroupFormatted) => {
        return selected_groups.value.some((g: UserGroupFormatted) => g.id === group.id) ? group.group_count : 0
    }

    const open = () => {
        visible.value = true;
    }

    const close = () => {
        selected_groups.value = []
        search.value = ''
        visible.value = false;
    }

    const handle_save = () => {
        if(!selected_groups.value.length || !broadcastStore.broadcast_id) return

        const group_ids = selected_groups.value.map((group: UserGroupFormatted) => group.id)
        const data_to_save: SaveSelectedGroupParams = {
            broadcast_id: broadcastStore.broadcast_id,
            group_ids
        }

        saveGroups(data_to_save, {
            onSuccess: (data: APIResponseSuccess | APIResponseError) => {
                if(data.result) {
                    show_success_toast('Success', 'Group added successfully!')
                    close()
                } else {
                    show_error_toast('Error', data.error || 'Something failed while saving the selected groups, please try again later.')
                }
            },
            onError: () => {
                show_error_toast('Error', 'Something failed while saving the selected groups, please try again later.')
            }
        })
    }

    defineExpose({ open })

    const all_selected = computed(() => groups_data.value.length > 0 && selected_groups.value?.length === groups_data.value.length)
    const selected_header_style = computed(() => all_selected.value ? { backgroundColor: '#9A83DB', color: '#fff' } : {})
    const rowClass = (data: UserGroupFormatted) => {
        return [{ '!bg-[#E9DDFF]': selected_groups.value.some((g: UserGroupFormatted) => g.id === data.id) }];
    };
</script>

<style scoped lang="scss">
:deep(.groups-table) {
    min-width: 30rem;

    .p-datatable-thead, .p-datatable-header-cell {
        background-color: rgb(233, 231, 235);

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
        height: 70px;
    }
}

:deep(.light-spinner) {
    .p-progressspinner-circle {
        stroke: white!important;
    }
}
</style>