<template>
    <SettingSection title="Text message caller ID" description="">
        <div class="flex justify-between gap-2 items-center">
            <label class="text-lg font-medium w-48">Caller ID</label>
            <Select v-model="text_settings.text_caller_id_selected" :options="text_caller_id_options" optionLabel="name" class="w-[294px]" placeholder="Select" />
        </div>
        <div v-if="text_settings.show_text_caller_id" class="flex justify-between items-center mt-7">
            <label class="text-lg font-medium w-48">Your Call Pro number</label>
            <PhoneInput class="!w-[294px]" :model-value="text_settings.text_caller_id" @update:modelValue="(v: string) => text_settings.text_caller_id = v" 
                :number-error="caller_id_error_message" @hasError="(val: boolean) => caller_id_error = val" 
            />
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
        textSettings: { type: [Object, null] as PropType<TextSettings | null>, required: true, default: null }
    })

    const emit = defineEmits(['updateTextSettings', 'hasError'])

    const caller_id_empty = ref(false)
    const caller_id_error = ref(false)
    const caller_id_error_message = ref('')

    const text_settings = reactive<TextSettingsUI>({
        show_text_caller_id: false,
        text_caller_id_selected: { name: '', code: '' },
        text_caller_id: '',
        chat: false,
        sms_dnc: false,
    });

    watch(() => props.textSettings, (newVal: TextSettings | null) => {
        if(newVal) {
            text_settings.show_text_caller_id = true
            text_settings.text_caller_id_selected = { name: 'Your CallPro Number', code: '1' }
            text_settings.text_caller_id = newVal.text_caller_id
            text_settings.chat = newVal.chat === '1'
            text_settings.sms_dnc = newVal.sms_dnc === '1'
        }
    })

    const text_caller_id_options = [
        { name: 'Your CallPro Number', code: '1' },
        { name: 'Toll Free Number', code: '2' },
    ]

    watch(text_settings, (updatedSettings: TextSettingsUI) => {
        if(updatedSettings.text_caller_id === '') {
            caller_id_empty.value = true
            caller_id_error_message.value = 'Call Pro number is required'
        } else {
            caller_id_empty.value = false
            caller_id_error_message.value = ''
        }

        emit('updateTextSettings', updatedSettings)
    })

    const hasError = computed(() => caller_id_empty.value || caller_id_error.value)
    watch(hasError, (newVal: boolean) => {
        emit('hasError', newVal)
    })
</script>