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
    </SettingSection>
    <Divider />
</template>

<script setup lang="ts">
    const props = defineProps({
        generalSettings: { type: [Object, null] as PropType<GeneralSettings | null>, required: true, default: null }
    })

    const generalStore = useGeneralStore()
    const emit = defineEmits(['updateGeneralSettings', 'hasError'])
    const time_zones_options: { name: string, code: OneToNine }[] = []

    onMounted(() => {
        if(generalStore.timezones.length) {
            generalStore.timezones.forEach((timezone: Timezone) => {
                time_zones_options.push({ name: timezone.display, code: timezone.zones_id })
            })
        } 
    })

    const general_settings = reactive<GeneralSettingsUI>({
        call_window_start: '',
        call_window_end: '',
        time_guard: false,
        time_zone: { name: '', code: '1' },
    });

    watch(() => props.generalSettings, (newVal: GeneralSettings | null) => {
        if(newVal) {
            console.log(newVal)
            general_settings.call_window_start = newVal.call_window_start
            general_settings.call_window_end = newVal.call_window_end
            general_settings.time_guard = newVal.time_guard === '1'
            general_settings.time_zone = format_time_zone(newVal.time_zone)
            console.log(general_settings.time_zone)
        }
    })

    const format_time_zone = (zone_id: OneToNine) => time_zones_options.find(option => option.code === zone_id) ?? time_zones_options[0]
    
    watch(general_settings, (updatedSettings: GeneralSettingsUI) => {
        emit('updateTextSettings', updatedSettings)
    })
</script>