<template>
    <div class="w-full pt-14">
        <div class="flex justify-between items-center">
            <label for="broadcast-start-time" class="text-lg text-dark-3 font-medium">Start time</label>
                <Select 
                    id="broadcast-start-time" 
                    v-model="second_step_data.start_time_selected" 
                    :options="time_options" 
                    optionLabel="name" 
                    optionValue="code" 
                    placeholder="Select time"
                    class="max-w-[294px] w-full border"
                    :class="{'placeholder-color': second_step_data.start_time_selected !== null}"
                    @change="handle_select_change"
                ></Select>
        </div>

        <Transition>
            <div v-if="second_step_data.start_time_selected === 'another'" class="flex justify-between items-center mt-4">
                <label for="broadcast-time" class="text-lg text-dark-3 font-medium">Choose start time</label>
                <DatePicker 
                    id="broadcast-time" 
                    v-model="parsedStartTime" 
                    showTime 
                    hourFormat="12" 
                    placeholder="Choose"
                    class="max-w-[294px] w-full rounded-full"
                    :minDate="minimum_time"
                    fluid
                    @hide="handle_check_time"
                />
            </div>
        </Transition>

        <Button @click="go_to_settings" class="bg-transparent border-none w-fit text-primary text-[13px] font-semibold hover:text-primary/80 mt-8">
            <ClockSVG class="w-[18px] h-[18px] mr-2 pt-[1px]" />
            {{ generalStore.user_timezone?.display }}
        </Button>
        <div class="h-[1px] w-full bg-grey-7 mt-12"></div>

        <Dialog v-model:visible="confirmationModal" :draggable="false" :closable="false"
            pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-full max-w-[580px]" pt:mask:class="bg-white bg-opacity-40 backdrop-blur-[1px]"
        >
            <template #container>
                <header class="w-full flex items-center justify-between px-8 pt-6 mb-2">
                    <h2 class="font-bold text-2xl text-dark-3">Time Guard Alert</h2>
                </header>

                <p class="text-dark-3 px-8 mt-4">This time is set for time guard.</p>
                <p class="text-dark-3 px-8">Your call will go out: <span class="font-bold">{{ format_start_time_to_view(suggested_start_time) }}</span></p>

                <div class="flex items-center gap-2 px-8 mt-3">
                    <Checkbox v-model="ignore_time_guard" binary inputId="ignore-tg" />
                    <label for="ignore-tg">Ignore the time guard.</label>
                </div>

                <div class="flex justify-end font-medium px-8 pb-6 mt-5">
                    <Button 
                        type="button" 
                        @click="handle_confirm_modal"
                        class="bg-primary rounded-lg border-primary text-white w-fit sm:max-w-[300px] h-10 hover:bg-[#4A1D6E]"
                    >
                        Accept
                    </Button>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
const generalStore = useGeneralStore();
const broadcastStore = useBroadcastStore();
const { second_step_data, show_suggested_start } = storeToRefs(broadcastStore)
const router = useRouter()

const time_options = [
    { name: 'Now', code: 'now' },
    { name: 'Another Time', code: 'another' },
]

const parsedStartTime = computed({
    get: () => second_step_data.value.start_time ? new Date(second_step_data.value.start_time) : null,
    set: (value: Date | null) => {
        second_step_data.value.start_time = value ? value.toISOString() : null
    }
})

// With query params included, to show the correct tab in settings page
const go_to_settings = () => {
    router.push({  name: 'settings', query: { tab: 'general' } })
}

const handle_select_change = () => {
    if(broadcastStore.second_step_data.start_time_selected === 'now') {
        broadcastStore.second_step_data.start_time = null
        handle_check_time()
    }
    broadcastStore.clearErrorMessage()
}

const minimum_time = computed(() => {
    const user_tz = generalStore?.user_timezone?.zone;
    if (!user_tz) return new Date();

    const now = new Date();
    const now_user_timezone = new Date(now.toLocaleString('en-US', { timeZone: user_tz }));
    return now_user_timezone;
})

const format_start_time_to_view = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date).replace(',', '');
};

const confirmationModal = ref(false)
const ignore_time_guard = ref(false)
const suggested_start_time = ref('')

const handle_confirm_modal = () => {
    if(!ignore_time_guard.value) {
        broadcastStore.second_step_data.start_time = suggested_start_time.value
        broadcastStore.second_step_data.start_time_selected = 'another'
    }
    confirmationModal.value = false
    ignore_time_guard.value = false
    suggested_start_time.value = ''
}

const handle_check_time = async () => {
    const data = broadcastStore.second_step_data
    if(data?.start_time_selected !== 'now' && !data?.start_time) return
    broadcastStore.clearErrorMessage()
    const response = await broadcastStore.checkStartTime()
    if(response.check === false) {
        suggested_start_time.value = response.suggested_start ? response.suggested_start : ''
        confirmationModal.value = true
    }
}

onMounted(() => {
    if(show_suggested_start.value.show) {
        suggested_start_time.value = show_suggested_start.value.suggested_start
        confirmationModal.value = true
    }
    broadcastStore.show_suggested_start = { show: false, suggested_start: '' }
})
</script>

<style scoped lang="scss">
:deep(.p-select) {
    .placeholder-color {
        color: #B3B3B3;
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>