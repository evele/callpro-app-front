<template>
    <SettingSection title="Caller ID" description="Set the phone number that appears on the caller ID.">
        <div class="flex justify-between gap-2 items-center mb-7">
            <label class="text-lg font-medium w-48">Caller ID</label>
            <Select v-model="caller_id_selected" :options="caller_id_options" optionLabel="name" class="w-[294px]" placeholder="Select" />
        </div>
        <div class="flex justify-between items-center">
            <label class="text-lg font-medium w-48">Enter Caller ID</label>
            <PhoneInput class="!w-[294px]" :model-value="voice_settings.caller_id" @update:modelValue="(v: string) => voice_settings.caller_id = v" />
        </div>
    </SettingSection>
    <Divider class="mb-[22px] "/>

    <SettingSection title="Static Intro" description="Include a professional or personalized message as an intro to your voice broadcast.">
        <div class="flex justify-between items-center mb-7">
            <label class="text-lg font-medium">Static audio introduction</label>
            <ToggleSwitch v-model="voice_settings.static_intro" @change="console.log(voiceSettings)" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Repeat" description="Give recipients of your message, the option to replay it.">
        <div class="flex justify-between items-center mb-7">
            <label class="text-lg font-medium">Repeat</label>
            <ToggleSwitch v-model="voice_settings.repeat" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Offer Do not Call response" description="Offer your recipients the chance to not receive future calls.">
        <div class="flex justify-between items-center mb-7">
            <label class="text-lg font-medium">DNC response</label>
            <ToggleSwitch v-model="voice_settings.offer_dnc" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Retries" description="The number of times the system have to call the recipient.">
        <div class="flex justify-between items-center mb-7 gap-2">
            <label class="text-lg font-medium">Number of Retries</label>
            <Select v-model="voice_settings.retries_selected" :options="retries_options" optionLabel="name" class="w-[294px]" placeholder="Select" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Call Speed" description="The number of calls the system have to call at once.">
        <div class="flex justify-between items-center mb-7 gap-2">
            <label class="text-lg font-medium max-w-48">Number of calls at once</label>
            <Select v-model="voice_settings.call_speed_selected" :options="call_speed_options" optionLabel="name" class="w-[294px]" placeholder="Select" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="AMD Detection" description="The system must detect if a machine answered the call. If it does, wait for the machine to stop playing the greeting.">
        <div class="flex justify-between items-center mb-7">
            <label class="text-lg font-medium">Stop playing if detects machine</label>
            <ToggleSwitch v-model="voice_settings.amd_detection" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Broadcast Confirmation Email" description="Receive an email when the broadcast is completed.">
        <div class="flex justify-between items-center mb-7">
            <label class="text-lg font-medium">Receive an email</label>
            <ToggleSwitch v-model="voice_settings.confirmation_email" />
        </div>
    </SettingSection>
    <Divider />

    <SettingSection title="Number when completed" description="Set a phone number to receive a call when the broadcast is completed.">
        <div class="flex justify-between items-center mb-5">
            <label class="text-lg font-medium">Number when completed</label>
            <ToggleSwitch v-model="voice_settings.number_when_completed_status" />
        </div>
        <div v-if="voice_settings.number_when_completed_status" class="flex justify-between items-center">
            <label class="text-lg font-medium w-48">Number To Send When Completed</label>
            <PhoneInput class="!w-[294px]" :model-value="voice_settings.number_when_completed" @update:modelValue="(v: string) => voice_settings.number_when_completed = v" />
        </div>
    </SettingSection>
</template>

<script setup lang="ts">
    const props = defineProps({
        voiceSettings: { type: [Object, null] as PropType<Settings | null>, required: true, default: null }
    })

    const emit = defineEmits(['updateVoiceSettings'])

    const voice_settings = reactive({
        caller_id: undefined,
        static_intro: undefined,
        repeat: undefined,
        offer_dnc: undefined,
        retries: undefined,
        call_speed: undefined,
        amd_detection: undefined,
        email_on_finish: undefined,
        number_when_completed_status: undefined,
        number_when_completed: undefined,
    })

    onMounted(() => {
        console.log(props.voiceSettings)
        if(props.voiceSettings) {
            voice_settings.caller_id = props.voiceSettings.caller_id
            voice_settings.static_intro = props.voiceSettings.static_intro === '1'
            voice_settings.repeat = props.voiceSettings.repeat === '1'
            voice_settings.offer_dnc = props.voiceSettings.offer_dnc === '1'
            voice_settings.retries = format_retries(props.voiceSettings.retries)
            voice_settings.call_speed = format_call_speed(props.voiceSettings.call_speed)
            voice_settings.amd_detection = props.voiceSettings.amd_detection === '1'
            voice_settings.email_on_finish = props.voiceSettings.email_on_finish === '1'
            voice_settings.number_when_completed_status = props.voiceSettings.number_when_completed_status === '1'
            voice_settings.number_when_completed = props.voiceSettings.number_when_completed
        }
        console.log(voice_settings)
    })
    
    const caller_id_options = [
        { name: 'Your CallPro Number', code: '1' },
        { name: 'Toll Free Number', code: '2' },
        { name: 'Choose Caller ID', code: '3' },
    ]
    const caller_id_selected = ref({ name: 'Choose Caller ID', code: '3' })

    const retries_options = [
        { name: '1', code: '1' },
        { name: '2', code: '2' },
        { name: '3', code: '3' },
        { name: '4', code: '3' },
    ]

    const call_speed_options = [
        { name: '5', code: '5' },
        { name: '20', code: '20' },
        { name: '50', code: '50' },
        { name: '100', code: '100' },
        { name: '200', code: '200' },
        { name: 'MAX', code: '999' },
    ]

    const format_retries = (retries: string) => retries_options.find(option => option.code === retries)

    const format_call_speed = (call_speed: string) => call_speed_options.find(option => option.code === call_speed)

    // watch(voice_settings, (newVal, oldVal) => {
    //     emit('updateVoiceSettings', newVal)
    // })
</script>
