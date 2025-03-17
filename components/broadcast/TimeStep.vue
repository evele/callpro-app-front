<template>
    <div class="w-full pt-14">
        <div class="flex justify-between items-center ">
            <label for="broadcast-name" class="text-lg text-dark-3 font-medium">Start time</label>
            <div class="relative max-w-[294px] w-full">
                <Select 
                    id="timezone" 
                    v-model="second_step_data.start_time_selected" 
                    :options="time_options" 
                    optionLabel="name" 
                    optionValue="code" 
                    placeholder="Select time"
                    class="w-full border"
                    :class="{'placeholder-color': second_step_data.start_time_selected !== null}"
                    :invalid="error_message?.length > 0"
                    @change="broadcastStore.clearErrorMessage"
                ></Select>
                <span v-show="error_message?.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                    {{ error_message }}
                </span> 
            </div>
        </div>
        <Button @click="go_to_settings" class="bg-transparent border-none w-fit text-primary text-[13px] font-semibold hover:text-primary/80 mt-8">
            <ClockSVG class="w-[18px] h-[18px] mr-2 pt-[1px]" />
            {{ generalStore.user_timezone?.display }}
        </Button>
        <div class="h-[1px] w-full bg-grey-7 mt-12"></div>
    </div>
</template>

<script setup lang="ts">
const generalStore = useGeneralStore();
const broadcastStore = useBroadcastStore();
const { second_step_data, error_message } = storeToRefs(broadcastStore)
const router = useRouter()

const time_options = [
    { name: 'Now', code: 'now' },
    { name: 'Another Time', code: 'another' },
]

const go_to_settings = () => {
    router.push({  name: 'settings', query: { tab: 'general' } })
}
</script>

<style scoped lang="scss">
:deep(.p-select) {
    .placeholder-color {
        color: #B3B3B3;
    }
}
</style>