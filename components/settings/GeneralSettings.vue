<template>
    <SettingSection title="Time zones" description="Set your time zone">
        <div class="flex justify-between items-center">
            <label class="font-medium">Time zone</label>
            <Select v-model="general_settings.time_zone" :options="time_zones_options" optionLabel="name" optionValue="code" 
                class="w-[294px]" placeholder="Select" @change="handle_update" 
            />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Call Time Guard" description="Set a time when the system will not dial any calls (i.e.: At night, etc).">
        <div class="flex justify-between items-center">
            <label class="font-medium">Set a time guard</label>
            <ToggleSwitch v-model="general_settings.time_guard" class="scale-110" @change="handle_update" />
        </div>
        
        <Transition>
            <div v-if="general_settings.time_guard" class="flex justify-between items-center mt-7">
                <label class="font-medium">Choose A Starting Time</label>
                <DatePicker v-model="general_settings.call_window_start" hourFormat="12" showIcon timeOnly iconDisplay="input"
                    class="w-[200px] flex items-center" @update:modelValue="handle_update"
                >
                    <template #inputicon="slotProps">
                        <ClockSVG class="text-[#334155] w-6" @click="slotProps.clickCallback" />
                    </template>
                </DatePicker>
            </div>
        </Transition>

        <Transition>
            <div v-if="general_settings.time_guard" class="flex justify-between items-center mt-5">
                <label class="font-medium">Choose An Ending Time</label>
                <DatePicker v-model="general_settings.call_window_end" hourFormat="12" showIcon timeOnly iconDisplay="input" 
                    class="w-[200px] flex items-center" @update:modelValue="handle_update"
                >
                    <template #inputicon="slotProps">
                        <ClockSVG class="text-[#334155] w-6" @click="slotProps.clickCallback" />
                    </template>
                </DatePicker>
            </div>
        </Transition>
    </SettingSection>
    <Divider />
</template>

<script setup lang="ts">
    const props = defineProps({
        generalSettings: { type: [Object, null] as PropType<GeneralSettings | null>, required: true, default: null }
    })

    type TimeZoneOpt = { name: string, code: OneToNine }

    const generalStore = useGeneralStore()
    const emit = defineEmits(['updateGeneralSettings', 'hasError'])
    const time_zones_options = ref<TimeZoneOpt[]>([])

    const general_settings = reactive<GeneralSettingsUI>({
        call_window_start: null,
        call_window_end: null,
        time_guard: false,
        time_zone: undefined,
    });

    onMounted(() => {
        if(generalStore.timezones.length) {
            generalStore.timezones.forEach((timezone: Timezone) => {
                time_zones_options.value.push({ name: timezone.display, code: timezone.zones_id })
            })
        } 

        if (props.generalSettings) {
            format_general_settings(props.generalSettings);
        }
    });

    watch(() => props.generalSettings, (newVal: GeneralSettings | null) => {
        if (newVal) {
            format_general_settings(newVal);
        }
    })

    const format_general_settings = (settings: GeneralSettings) => {
        general_settings.call_window_start = parse_time(settings.call_window_start)
        general_settings.call_window_end = parse_time(settings.call_window_end)
        general_settings.time_guard = settings.time_guard === '1'
        general_settings.time_zone = settings.time_zone
    }

    const parse_time = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0);
        return date;
    }

    const format_time = (date: Date | null): string => {
        if (!date || !(date instanceof Date)) return '0000-00-00 00:00';

        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const handle_update = () => {
        const settings_to_save: GeneralSettings = {
            call_window_start: format_time(general_settings.call_window_start),
            call_window_end: format_time(general_settings.call_window_end),
            time_guard: general_settings.time_guard ? '1' : '0',
            time_zone: general_settings.time_zone ?? '1',
        }
        emit('updateGeneralSettings', settings_to_save)
    }
</script>

<style scoped lang="scss">
:deep(.p-datepicker) {
    .p-datepicker-input-icon-container {
        top: 40%;
    }
}

.v-enter-active {
    transition: opacity 0.5s ease;
}
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>