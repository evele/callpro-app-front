<template>
    <section>
        <Transition name="fade" mode="out-in">
            <SelectedNumbersTable 
                v-if="broadcastStore.show_contacts_table" 
                :table-data="table_data"
                :monthly-numbers-data="monthly_numbers_data"
                :is-loading="isLoading"
                @update:action-selected="handle_btn_action"
            />
            <div v-else>
                <div class="grid-container mt-4">
                    <NumbersBtn @click="console.log(table_data, monthly_numbers_data)">
                        <div class="flex flex-col items-center gap-2">
                            <ContactsSVG class="w-10 h-10" />
                            <span class="text-xs font-semibold tracking-wider">Choose from Contacts</span>
                        </div>
                    </NumbersBtn>
                    <NumbersBtn @click="handle_open_choose_groups_modal" :disabled="disabled_groups_btn">
                        <div class="flex flex-col items-center gap-2">
                            <GroupsSVG class="w-10 h-10" />
                            <span class="text-xs font-semibold tracking-wider">Choose from Groups</span>
                        </div>
                    </NumbersBtn>
                    <NumbersBtn>
                        <div class="flex flex-col items-center gap-2">
                            <PlusRoundedSVG class="w-10 h-10" />
                            <span class="text-xs font-semibold tracking-wider">Add new number</span>
                        </div>
                    </NumbersBtn>
                    <NumbersBtn @click="get_table_data">
                        <div class="flex flex-col items-center gap-2">
                            <UploadSVG class="w-10 h-10" />
                            <span class="text-xs font-semibold tracking-wider">Upload file</span>
                        </div>
                    </NumbersBtn>
                </div>

            </div>
        </Transition>

        <ChooseGroupsModal ref="chooseGroupsModalRef" @update:data-loaded="handle_has_data_loaded" />
    </section>
</template>

<script setup lang="ts">
    const broadcastStore = useBroadcastStore();
    const tts_merge_enable = ref<boolean>('0');

    const query_params = computed<BSNQueryParams>(() => ({
        broadcast_id: broadcastStore.broadcast_id,
        start_limit: 0,
        length_limit: 10,
        search: '',
        order_column_index: 0,
        order_dir: 'desc'
    }))

    const { data: dataBSN, isLoading, refetch: getBSN } = useFetchGetBroadcastSelectedNumbers(query_params)
    const { data: monthlyNumbersData, refetch: refetchMonthlyNumbers } = useFetchGetTotalMonthlyNumbers(broadcastStore.broadcast_id ,tts_merge_enable)

    const get_table_data = async () => {
        const response = await getBSN()
        if(response?.data?.result && response.data.data.numbers_data.length > 0) {
            broadcastStore.show_contacts_table = true
        }
    }

    onMounted(() => get_table_data())

    const table_data = computed<GetBSNResponse | []>(() => {
        if (!dataBSN?.value?.result) return []
        console.log(dataBSN.value.data)
        return dataBSN.value.data
    })

    const monthly_numbers_data = computed<TotalMonthlyNumbersData>(() => {
        if (!monthlyNumbersData?.value?.result) return { total_contacts: 0, total_numbers: 0 }
        return {
            total_contacts: monthlyNumbersData.value.total_contacts,
            total_numbers: monthlyNumbersData.value.total_numbers
        }
    })

    const handle_btn_action = (action: BroadcastNumbersBtnActions) => {
        switch (action) {
            case 'contacts':
                break
            case 'groups':
                handle_open_choose_groups_modal()
                break
            case 'new':
                break
            case 'upload':
                break
            case 'clear':
                break
        }
    }

    /* ----- Choose groups section ----- */
    const chooseGroupsModalRef = ref()
    const disabled_groups_btn = ref(true)
    const handle_open_choose_groups_modal = () => {
        chooseGroupsModalRef.value?.open()
    }

    const handle_has_data_loaded = (has_loaded: boolean) => {
        disabled_groups_btn.value = has_loaded ? false : true
    }

</script>
<style scoped lang="scss">
    .grid-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 28px;

        @media (min-width: 1024px) {
            grid-template-columns: repeat(2, minmax(270px, 1fr));
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>