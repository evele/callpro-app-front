<template>
    <section>
        <div class="grid-container mt-4">
            <NumbersBtn>
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
            <NumbersBtn>
                <div class="flex flex-col items-center gap-2">
                    <UploadSVG class="w-10 h-10" />
                    <span class="text-xs font-semibold tracking-wider">Upload file</span>
                </div>
            </NumbersBtn>
        </div>

        <ChooseGroupsModal ref="chooseGroupsModalRef" @update:data-loaded="handle_disabled_groups_btn" />
    </section>
</template>

<script setup lang="ts">
    const broadcastStore = useBroadcastStore();
    const tts_merge_enable = ref<boolean>('0');

    const { data: monthlyNumbersData, refetch: refetchMonthlyNumbers } = useFetchGetTotalMonthlyNumbers(broadcastStore.broadcast_id ,tts_merge_enable)


    /* ----- Choose groups section ----- */
    const chooseGroupsModalRef = ref()
    const disabled_groups_btn = ref(true)
    const handle_open_choose_groups_modal = () => {
        chooseGroupsModalRef.value?.open()
    }

    const handle_disabled_groups_btn = (value: boolean) => {
        console.log('llega?', value)
        disabled_groups_btn.value = value
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
</style>