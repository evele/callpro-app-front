<template>
    <SettingSection title="Caller ID" description="Set the phone number that appears on the caller ID.">
        <div class="flex justify-between gap-2 items-center">
            <label class="text-lg font-medium w-48">Caller ID</label>
            <Select v-model="voice_settings.caller_id_selected" :options="caller_id_options" optionLabel="name" optionValue="code" class="w-[294px]" placeholder="Select" />
        </div>
        <div :key="voice_settings.caller_id_selected" class="flex justify-between items-center mt-7">
            <label class="text-lg font-medium w-48">Enter Caller ID</label>
            <PhoneInput class="!w-[294px]" :model-value="voice_settings.caller_id" @update:modelValue="(v: string) => voice_settings.caller_id = v" 
                :number-error="caller_id_error_message" @hasError="(val: boolean) => caller_id_error = val" 
            />
        </div>
    </SettingSection>
    <Divider/>

    <SettingSection title="Static Intro" description="Include a professional or personalized message as an intro to your voice broadcast.">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Static audio introduction</label>
            <ToggleSwitch v-model="voice_settings.static_intro" class="scale-125" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Repeat" description="Give recipients of your message, the option to replay it.">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Repeat</label>
            <ToggleSwitch v-model="voice_settings.repeat" class="scale-125" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Offer Do not Call response" description="Offer your recipients the chance to not receive future calls.">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">DNC response</label>
            <ToggleSwitch v-model="voice_settings.offer_dnc" class="scale-125" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Retries" description="The number of times the system have to call the recipient.">
        <div class="flex justify-between items-center gap-2">
            <label class="text-lg font-medium">Number of Retries</label>
            <Select v-model="voice_settings.retries" :options="retries_options" class="w-[294px]" placeholder="Select" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Call Speed" description="The number of calls the system have to call at once.">
        <div class="flex justify-between items-center gap-2">
            <label class="text-lg font-medium max-w-48">Number of calls at once</label>
            <Select v-model="voice_settings.call_speed" :options="call_speed_options" optionLabel="name" optionValue="code" class="w-[294px]" placeholder="Select" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="AMD Detection" description="The system must detect if a machine answered the call. If it does, wait for the machine to stop playing the greeting.">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Stop playing if detects machine</label>
            <ToggleSwitch v-model="voice_settings.amd_detection" class="scale-125" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Broadcast Confirmation Email" description="Receive an email when the broadcast is completed.">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Receive an email</label>
            <ToggleSwitch v-model="voice_settings.email_on_finish" class="scale-125" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Number when completed" description="Set a phone number to receive a call when the broadcast is completed.">
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium">Number when completed</label>
            <ToggleSwitch v-model="voice_settings.number_when_completed_status" class="scale-125" />
        </div>
        <div v-if="voice_settings.number_when_completed_status" class="flex justify-between items-center mt-7">
            <label class="text-lg font-medium w-48">Number To Send When Completed</label>
            <PhoneInput class="!w-[294px]" :model-value="voice_settings.number_when_completed" @update:modelValue="(v: string) => voice_settings.number_when_completed = v" 
                :number-error="number_when_completed_error_message" @hasError="(val: boolean) => number_when_completed_error = val"    
            />
        </div>
    </SettingSection>
</template>

<script setup lang="ts">
    const props = defineProps({
        voiceSettings: { type: [Object, null] as PropType<VoiceSettings | null>, required: true, default: null }
    })

    const emit = defineEmits(['updateVoiceSettings', 'hasError'])

    const caller_id_empty = ref(false)
    const caller_id_error = ref(false)
    const caller_id_error_message = ref('')
    const number_when_completed_empty = ref(false)
    const number_when_completed_error = ref(false)
    const number_when_completed_error_message = ref('')

    const voice_settings = reactive<VoiceSettingsUI>({
        caller_id_selected: undefined,
        caller_id: '',
        static_intro: false,
        repeat: false,
        offer_dnc: false,
        retries: undefined,
        call_speed: undefined,
        amd_detection: false,
        email_on_finish: false,
        number_when_completed_status: false,
        number_when_completed: '',
    });

    onMounted(() => {
        if(props.voiceSettings) {
            voice_settings.caller_id_selected = '3'
            voice_settings.caller_id = props.voiceSettings.caller_id
            voice_settings.static_intro = props.voiceSettings.static_intro === '1'
            voice_settings.repeat = props.voiceSettings.repeat === '1'
            voice_settings.offer_dnc = props.voiceSettings.offer_dnc === '1'
            voice_settings.retries = props.voiceSettings.retries
            voice_settings.call_speed = props.voiceSettings.call_speed
            voice_settings.amd_detection = props.voiceSettings.amd_detection === '1'
            voice_settings.email_on_finish = props.voiceSettings.email_on_finish === '1'
            voice_settings.number_when_completed_status = props.voiceSettings.number_when_completed_status === '1'
            voice_settings.number_when_completed = props.voiceSettings.number_when_completed
        }
    })
    
    const caller_id_options = [
        { name: 'Your CallPro Number', code: '1' },
        { name: 'Toll Free Number', code: '2' },
        { name: 'Choose Caller ID', code: '3' },
    ]

    const retries_options = ['1', '2', '3', '4'];

    const call_speed_options: { name: string; code: CallSpeed }[] = [
        { name: '5', code: '5' },
        { name: '20', code: '20' },
        { name: '50', code: '50' },
        { name: '100', code: '100' },
        { name: '200', code: '200' },
        { name: 'MAX', code: '999' },
    ]

    watch(voice_settings, (updatedSettings: VoiceSettingsUI) => {
        if(updatedSettings.caller_id === '') {
            caller_id_empty.value = true
            caller_id_error_message.value = 'Caller ID is required'
        } else {
            caller_id_empty.value = false
            caller_id_error_message.value = ''
        }

        if(updatedSettings.number_when_completed === '' && updatedSettings.number_when_completed_status) {
            number_when_completed_empty.value = true
            number_when_completed_error_message.value = 'Number when completed is required'
        } else {
            number_when_completed_empty.value = false
            number_when_completed_error_message.value = ''
        }

        emit('updateVoiceSettings', updatedSettings)
    })

    const hasError = computed(() => (caller_id_empty.value || number_when_completed_empty.value) || (caller_id_error.value || number_when_completed_error.value))
    watch(hasError, (newVal: boolean) => {
        emit('hasError', newVal)
    })
</script>
