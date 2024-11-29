<template>
    <SettingSection title="Time zones" description="Set your time zone">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Time zone</label>
            <Select v-model="general_settings.time_zone" :options="time_zones_options" optionLabel="name" class="w-[294px]" placeholder="Select" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Call Time Guard" description="Set a time when the system will not dial any calls (i.e.: At night, etc).">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Set a time guard</label>
            <ToggleSwitch v-model="general_settings.time_guard" class="scale-125" />
        </div>
        
        <div v-if="general_settings.time_guard" class="flex justify-between items-center mt-7">
            <label class="text-lg font-medium">Choose A Starting Time</label>
            <DatePicker v-model="general_settings.call_window_start" hourFormat="12" :manualInput="false" showIcon timeOnly iconDisplay="input" class="w-[294px] flex items-center">
                <template #inputicon="slotProps">
                    <ClockSVG class="text-[#334155] w-6" @click="slotProps.clickCallback" />
                </template>
            </DatePicker>
        </div>

        <div v-if="general_settings.time_guard" class="flex justify-between items-center mt-5">
            <label class="text-lg font-medium">Choose An Ending Time</label>
            <DatePicker v-model="general_settings.call_window_end" hourFormat="12" :manualInput="false" showIcon timeOnly iconDisplay="input" class="w-[294px] flex items-center">
                <template #inputicon="slotProps">
                    <ClockSVG class="text-[#334155] w-6" @click="slotProps.clickCallback" />
                </template>
            </DatePicker>
        </div>
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

    onMounted(() => {
        if(generalStore.timezones.length) {
            generalStore.timezones.forEach((timezone: Timezone) => {
                time_zones_options.value.push({ name: timezone.display, code: timezone.zones_id })
            })
        } 
    })

    const general_settings = reactive<GeneralSettingsUI>({
        call_window_start: null,
        call_window_end: null,
        time_guard: false,
        time_zone: { name: '', code: '1' },
    });

    watch(() => props.generalSettings, (newVal: GeneralSettings | null) => {
        if(newVal) {
            general_settings.call_window_start = parse_time(newVal.call_window_start)
            general_settings.call_window_end = parse_time(newVal.call_window_end)
            general_settings.time_guard = newVal.time_guard === '1'
            general_settings.time_zone = format_time_zone(newVal.time_zone)
        }
    })

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

    const format_time_zone = (zone_id: OneToNine) => time_zones_options.value.find((option: TimeZoneOpt) => option.code === zone_id) ?? time_zones_options.value[0]
    
    watch(general_settings, (updatedSettings: GeneralSettingsUI) => {
        const settings_to_save: GeneralSettings = {
            call_window_start: format_time(updatedSettings.call_window_start),
            call_window_end: format_time(updatedSettings.call_window_end),
            time_guard: updatedSettings.time_guard ? '1' : '0',
            time_zone: updatedSettings.time_zone.code,
        }
        emit('updateGeneralSettings', settings_to_save)
    })
</script>

<style scoped lang="scss">
:deep(.p-datepicker) {
    .p-datepicker-input-icon-container {
        top: 40%;
    }
}
</style>