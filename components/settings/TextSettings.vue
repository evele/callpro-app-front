<template>
    <SettingSection title="Text message caller ID" description="">
        <div class="flex justify-between gap-2 items-center">
            <label class="text-lg font-medium w-48">Caller ID</label>
            <Select v-model="text_settings.text_caller_id_selected" :options="text_caller_id_options" optionLabel="name" optionValue="code" class="w-[294px]" placeholder="Select" />
        </div>
        <div class="flex justify-between items-center mt-7">
            <label class="text-lg font-medium w-48">Your Call Pro number</label>
            <Select v-if="text_settings.text_caller_id_selected === '1'" v-model="selected_call_pro" :options="formatted_callpro_numbers" class="w-[294px]" placeholder="Select" :disabled="props.callProNumbers.length < 2" />
            <Select v-else v-model="selected_toll_free" :options="formatted_tollfree_numbers" class="w-[294px]" placeholder="Select" :disabled="props.tollFreeNumbers.length < 2" />
        </div>
    </SettingSection>
    <Divider/>

    <SettingSection title="Chat" description="">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Chat</label>
            <ToggleSwitch v-model="text_settings.chat" class="scale-125" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Offer Opt out response" description="Offer your recipients the chance to not receive future messages.">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Opt out response</label>
            <ToggleSwitch v-model="text_settings.sms_dnc" class="scale-125" />
        </div>
    </SettingSection>
    <Divider />
</template>

<script setup lang="ts">
    const props = defineProps({
        textSettings: { type: [Object, null] as PropType<TextSettings | null>, required: true, default: null },
        callProNumbers: { type: Array as PropType<string[]>, required: true, default: [] },
        tollFreeNumbers: { type: Array as PropType<string[]>, required: true, default: [] }
    })

    const emit = defineEmits(['updateTextSettings'])

    const text_settings = reactive<TextSettingsUI>({
        text_caller_id_selected: '1',
        text_caller_id: '',
        call_pro_number: '',
        toll_free_number: '',
        chat: false,
        sms_dnc: false,
    });

    onMounted(() => {
        if (props.textSettings) {
            format_text_settings(props.textSettings);
        }
    });

    watch(() => props.textSettings, (newVal: TextSettings | null) => {
        if (newVal) {
            format_text_settings(newVal);
        }
    });

    const format_text_settings = (settings: TextSettings) => {
        if(props.callProNumbers.includes(settings.text_caller_id)) {
                const db_number = props.callProNumbers.find((number: string) => number === settings?.text_caller_id)
                text_settings.call_pro_number = db_number ? format_number_to_show(db_number) : ''
            } else if(props.tollFreeNumbers.length && props.tollFreeNumbers.includes(settings?.text_caller_id)) {
                text_settings.text_caller_id_selected = '2'
                const db_number = props.tollFreeNumbers.find((number: string) => number === settings?.text_caller_id)
                text_settings.toll_free_number = db_number ? format_number_to_show(db_number) : ''
            }

            if(text_settings.call_pro_number === '') {
                text_settings.call_pro_number = format_number_to_show(props.callProNumbers[0])
            }
            if(text_settings.toll_free_number === '') {
                text_settings.toll_free_number = props.tollFreeNumbers.length ? format_number_to_show(props.tollFreeNumbers[0]) : ''
            }

        text_settings.chat = settings.chat === '1'
        text_settings.sms_dnc = settings.sms_dnc === '1'
    }

    const selected_call_pro = computed({
        get: () => text_settings.call_pro_number,
        set: (val: string) => (text_settings.call_pro_number = val),
    });

    const selected_toll_free = computed({
        get: () => text_settings.toll_free_number,
        set: (val: string) => (text_settings.toll_free_number = val),
    });

    const formatted_callpro_numbers = computed(() => {
        return props.callProNumbers?.map((number: string) => format_number_to_show(number))
    })

    const formatted_tollfree_numbers = computed(() => {
        return props.tollFreeNumbers?.map((number: string) => format_number_to_show(number))
    })

    const text_caller_id_options = computed(() => {
        const options = []
        options.push({ name: 'Your CallPro Number', code: '1' })
        if(props.tollFreeNumbers.length) {
            options.push({ name: 'Toll Free Number', code: '2' })
        }

        return options
    })

    watch(text_settings, (updatedSettings: TextSettingsUI) => {
        emit('updateTextSettings', updatedSettings)
    })
</script>