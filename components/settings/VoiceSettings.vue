<template>
    <SettingSection title="Caller ID" description="Set the phone number that appears on the caller ID.">
        <div class="flex justify-between gap-2 items-center">
            <label class="text-lg font-medium w-48">Caller ID</label>
            <Select v-model="voice_settings.caller_id_selected" :options="caller_id_options" optionLabel="name" optionValue="code" class="w-[294px]" placeholder="Select" @change="handle_select_change" />
        </div>

        <div v-if="voice_settings.caller_id_selected !== '3'" class="flex justify-between items-center mt-7">
            <label class="text-lg font-medium w-48">Your CallPro Number</label>
            <Select v-if="voice_settings.caller_id_selected === '1'" v-model="selected_call_pro" :options="formatted_callpro_numbers" class="w-[294px]" placeholder="Select" :disabled="props.callProNumbers.length < 2" />
            <Select v-else v-model="selected_toll_free" :options="formatted_tollfree_numbers" class="w-[294px]" placeholder="Select" :disabled="props.tollFreeNumbers.length < 2" />
        </div>

        <div v-else :key="voice_settings.caller_id_selected" class="flex justify-between items-center mt-7">
            <label class="text-lg font-medium w-48">{{ cidConfirm == '1' ? 'Select Caller ID' : 'Enter Caller ID' }}</label>

            <div v-if="cidConfirm == '1'" class="relative">
                <CallerIDSelect
                    :model-value="voice_settings.caller_id"
                    :is-loading="isLoadingCallerID" 
                    :caller-id-numbers="caller_id_numbers"
                    @update:modelValue="handle_caller_id_selection"
                    @update:error="handle_caller_id_number_error"
                />
                <Button type="button" @click="handle_open_caller_id_modal" class="w-5 h-5 absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <template #icon>
                        <PlusSVG class="w-[14px] h-[14px]" />
                    </template>
                </Button>
            </div>

            <PhoneInput v-else class="!w-[294px]" :model-value="voice_settings.caller_id" @update:modelValue="(v: string) => voice_settings.caller_id = v" 
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
        <div v-if="voice_settings.static_intro" class="flex justify-between items-center mt-7">
            <p class="text-lg underline italic">{{voice_settings.static_intro_audio_selected?.name}}</p>
            <div class="flex items-center gap-2">
                <span v-if="static_intro_error" class="text-red-500">{{ static_intro_error_message }}</span>
                <Button @click="handle_open_static_intro_modal(voice_settings.static_intro_audio_selected?.id)" 
                    class="w-7 h-7 bg-[#e7e0ec] rounded-full] text-[#1D1B20] border-none hover:scale-110 transition-transform"
                >
                    <template #icon>
                        <EditIconSVG class="w-4 h-4 relative bg-[#e7e0ec] rounded-[10px]" />
                    </template>
                </Button>
            </div>
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

    <StaticIntroModal ref="staticIntroModalRef" @update:selected-audio="handle_audio_selection" />
    <CallerIDModal ref="callerIDModalRef" @update:deleted_number="handle_delete_caller_id" />
</template>

<script setup lang="ts">
    import EditIconSVG from '../svgs/EditIconSVG.vue'

    const props = defineProps({
        voiceSettings: { type: [Object, null] as PropType<VoiceSettingsWithAudio | null>, required: true, default: null },
        callProNumbers: { type: Array as PropType<string[]>, required: true, default: [] },
        tollFreeNumbers: { type: Array as PropType<string[]>, required: true, default: [] },
        cidConfirm: { type: String as PropType<'0' | '1'>, required: true, default: '0' }
    })

    const { data: callerIDNumbers, isLoading: isLoadingCallerID, refetch: getCallerIDNumbers } = useFetchCallerIDNumbers(false)
    const emit = defineEmits(['updateVoiceSettings', 'hasError'])

    const caller_id_empty = ref(false)
    const caller_id_error = ref(false)
    const caller_id_error_message = ref('')
    const number_when_completed_empty = ref(false)
    const number_when_completed_error = ref(false)
    const number_when_completed_error_message = ref('')
    const static_intro_error = ref(false)
    const static_intro_error_message = ref('')

    const voice_settings = reactive<VoiceSettingsUI>({
        caller_id_selected: undefined,
        caller_id: '',
        call_pro_number: '',
        toll_free_number: '',
        static_intro: false,
        static_intro_library_id: undefined,
        static_intro_audio_selected: undefined,
        repeat: false,
        offer_dnc: false,
        retries: undefined,
        call_speed: undefined,
        amd_detection: false,
        email_on_finish: false,
        number_when_completed_status: false,
        number_when_completed: '',
    });

    const temp_selected_caller_id = ref('')

    onMounted(() => {
        if(props.voiceSettings) {
            if(props.cidConfirm === '1') {
                getCallerIDNumbers()
            }

            if(props.callProNumbers.includes(props.voiceSettings.caller_id)) {
                voice_settings.caller_id_selected = '1'
                const db_number = props.callProNumbers.find((number: string) => number === props.voiceSettings?.caller_id)
                voice_settings.call_pro_number = db_number ? format_number_to_show(db_number) : ''
            } else if(props.tollFreeNumbers.length && props.tollFreeNumbers.includes(props.voiceSettings?.caller_id)) {
                voice_settings.caller_id_selected = '2'
                const db_number = props.tollFreeNumbers.find((number: string) => number === props.voiceSettings?.caller_id)
                voice_settings.toll_free_number = db_number ? format_number_to_show(db_number) : ''
            } else {
                voice_settings.caller_id_selected = '3'
            }

            
            if(voice_settings.call_pro_number === '') {
                voice_settings.call_pro_number = format_number_to_show(props.callProNumbers[0])
            }
            if(voice_settings.toll_free_number === '') {
                voice_settings.toll_free_number = props.tollFreeNumbers.length ? format_number_to_show(props.tollFreeNumbers[0]) : ''
            }

            voice_settings.caller_id = props.voiceSettings.caller_id
            voice_settings.static_intro = props.voiceSettings.static_intro === '1'
            voice_settings.static_intro_library_id = props.voiceSettings.static_intro_library_id
            voice_settings.static_intro_audio_selected = props.voiceSettings.static_intro_audio_selected
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

    const selected_call_pro = computed({
        get: () => voice_settings.call_pro_number,
        set: (val: string) => (voice_settings.call_pro_number = val),
    });

    const selected_toll_free = computed({
        get: () => voice_settings.toll_free_number,
        set: (val: string) => (voice_settings.toll_free_number = val),
    });
    
    const caller_id_options = computed(() => {
        const options = []
        options.push({ name: 'Your CallPro Number', code: '1' })
        if(props.tollFreeNumbers.length) {
            options.push({ name: 'Toll Free Number', code: '2' })
        }
        options.push({ name: 'Choose Caller ID', code: '3' })

        return options
    })

    const formatted_callpro_numbers = computed(() => {
        return props.callProNumbers?.map((number: string) => format_number_to_show(number))
    })

    const formatted_tollfree_numbers = computed(() => {
        return props.tollFreeNumbers?.map((number: string) => format_number_to_show(number))
    })

    const retries_options = ['1', '2', '3', '4'];

    const call_speed_options: { name: string; code: CallSpeed }[] = [
        { name: '5', code: '5' },
        { name: '20', code: '20' },
        { name: '50', code: '50' },
        { name: '100', code: '100' },
        { name: '200', code: '200' },
        { name: 'MAX', code: '999' },
    ]

    const handle_select_change = (event: { originalEvent: Event, value: any }) => {
        if(props.cidConfirm == '1') {
            if(event.value === '1') {
                voice_settings.caller_id = selected_call_pro.value
            } else if(event.value === '2') {
                voice_settings.caller_id = selected_toll_free.value
            } else {
                voice_settings.caller_id = temp_selected_caller_id.value
            }
            caller_id_error.value = false
        }
    }

    watch(voice_settings, (updatedSettings: VoiceSettingsUI) => {
        if(updatedSettings.caller_id_selected === '3' && updatedSettings.caller_id === '') {
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

        if(updatedSettings.static_intro && !updatedSettings.static_intro_library_id) {
            static_intro_error.value = true
            static_intro_error_message.value = 'Static intro audio is required'
        } else {
            static_intro_error.value = false
            static_intro_error_message.value = ''
        }

        emit('updateVoiceSettings', updatedSettings)
    })

    const hasError = computed(() => {
        return (caller_id_empty.value || number_when_completed_empty.value) ||
               (caller_id_error.value || number_when_completed_error.value || static_intro_error.value)
    })
    watch(hasError, (newVal: boolean) => {
        emit('hasError', newVal)
    })

    /* ----- Static Intro Section ----- */
    const staticIntroModalRef = ref()
    const handle_open_static_intro_modal = (audio_id: number | undefined) => {
        staticIntroModalRef.value?.open(audio_id)
    }

    const handle_audio_selection = (selected_audio: Audio) => {
        voice_settings.static_intro_library_id = selected_audio.id
        voice_settings.static_intro_audio_selected = selected_audio
    }

    /* ----- Caller ID Section ----- */
    const callerIDModalRef = ref()
    const caller_id_numbers = computed((): CallerID[] => {
        if(!callerIDNumbers?.value?.result) return []
        return callerIDNumbers.value.caller_ids
    })

    const handle_caller_id_selection = (caller_id: CallerID) => {
        if(!caller_id) return
        temp_selected_caller_id.value = caller_id.caller_id
        voice_settings.caller_id = caller_id.caller_id
    }

    const handle_caller_id_number_error = (error: boolean) => {
       caller_id_error.value = error
    }

    const handle_open_caller_id_modal = () => {
        callerIDModalRef.value?.open(voice_settings.caller_id)
    }

    const handle_delete_caller_id = (deleted_number: string) => {
        if(!deleted_number) return
        if(voice_settings.caller_id === deleted_number) {
            temp_selected_caller_id.value = ''
            voice_settings.caller_id = ''
        }
    }
</script>