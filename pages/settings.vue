<template>
    <div>
        <p class="text-title">Settings page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error.message }}</span>
        <ul v-else>
            <li v-for="tz in settings.timezones" :key="tz.zones_id">{{ tz.display }}</li>
        </ul>
        <button type="button" @click="load_settings">Load settings</button>

        <div v-if="isSuccess" style="padding: 10px 0 2rem 1rem;">
            <p v-if="isFetching">Updating data...</p>
            <div v-else>
                <div>
                    <h2>Voice settings:</h2>
                    <p class="setting-label">Caller ID: <span class="setting-value"> {{ settings?.settings?.caller_id }}</span></p>
                    <p class="setting-label">Static Intro: <span class="setting-value"> {{ format_value(settings?.settings?.static_intro) }}</span></p>
                    <p class="setting-label">Repeat: <span class="setting-value"> {{ format_value(settings?.settings?.repeat) }}</span></p>
                    <p class="setting-label">Offer Do Not Call (DNC) Response: <span class="setting-value"> {{ format_value(settings?.settings?.offer_dnc) }}</span></p>
                    <p class="setting-label">Retries: <span class="setting-value"> {{ settings?.settings?.retries }}</span></p>
                    <p class="setting-label">Call Speed: <span class="setting-value"> {{ settings?.settings?.call_speed }}</span></p>
                    <p class="setting-label">ADM Detection ID: <span class="setting-value"> {{ format_value(settings?.settings?.amd_detection) }}</span></p>
                    <p class="setting-label">Broadcast Confirmation Email: <span class="setting-value"> {{ format_value(settings?.settings?.email_on_finish) }}</span></p>
                    <p class="setting-label">Number When Completed: <span class="setting-value"> {{ format_value(settings?.settings?.number_when_completed_status) }}</span></p>
                    <p class="setting-label">Call Time Guard: <span class="setting-value"> {{ format_value(settings?.settings?.time_guard) }}</span></p>
                    <p class="setting-label">Time Zones: <span class="setting-value"> {{ format_tz(settings?.settings?.time_zone) }}</span></p>
                    <button type="button" @click="save_voice_settings">{{ !isPending ? 'Save Voice Settings' : 'Saving...' }}</button>
                
                    <div style="margin-top: 10px;">
                        <span v-if="updateVoiceIsError" style="color: red;">Error: {{ updateVoiceError.message }}</span>
                        <span v-if="updateVoiceIsSuccess" style="color: green;">Voice settings successfully updated!</span>
                    </div>
                </div>
                <div>
                    <h2>Text settings:</h2>
                    <p class="setting-label">Text message caller ID: <span class="setting-value"> {{ settings?.text_settings?.text_caller_id }}</span></p>
                    <p class="setting-label">Chat: <span class="setting-value"> {{ format_value(settings?.text_settings?.chat) }}</span></p>
                    <p class="setting-label">Offer Opt Out Response: <span class="setting-value"> {{ format_value(settings?.text_settings?.sms_dnc) }}</span></p>
                    
                    <button type="button" @click="save_text_settings">{{ !updateTextIsPending ? 'Save Text Settings' : 'Saving...' }}</button>
                
                    <div style="margin-top: 10px;">
                        <span v-if="updateTextIsError" style="color: red;">Error: {{ updateTextError.message }}</span>
                        <span v-if="updateTextIsSuccess" style="color: green;">Voice settings successfully updated!</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const { data: settings, isSuccess, error, isLoading, isFetching, isError, refetch } = useFetchSettings()
    const { mutate: updateVoiceSettings, isPending, isError: updateVoiceIsError, error: updateVoiceError, isSuccess: updateVoiceIsSuccess } = useUpdateVoiceSettings()
    const { mutate: updateTextSettings, isPending: updateTextIsPending, isError: updateTextIsError, error: updateTextError, isSuccess: updateTextIsSuccess } = useUpdateTextSettings()
    
    const load_settings = () => {
        refetch()
    }

    const voice_settings = computed(() => ({
        'caller_id': settings.value.settings.caller_id,
        'static_intro': settings.value.settings.static_intro,
        'static_intro_library_id': settings.value.settings.static_intro_library_id,
        'repeat': settings.value.settings.repeat,
        'repeat_audio': settings.value.settings.repeat_audio,
        'repeat_library_id': settings.value.settings.repeat_library_id,
        'offer_dnc': settings.value.settings.offer_dnc,
        'retries': settings.value.settings.retries,
        'call_speed': settings.value.settings.call_speed,
        'amd_detection': settings.value.settings.amd_detection,
        'email_on_finish': settings.value.settings.email_on_finish,
        'number_when_completed_status': settings.value.settings.number_when_completed_status,
        'number_when_completed': settings.value.settings.number_when_completed,
        'time_guard': settings.value.settings.time_guard,
        'time_zone': settings.value.settings.time_zone,
    }))

    const format_value = (value) => value == '1' ? 'On' : 'Off';

    const time_zones = computed(() => settings.value.timezones)

    const format_date_time = (time) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${time.slice(0, 5)}`;

        return formattedDate;
    }

    const format_tz = (value) => {
        if(!time_zones.value.length) return '';
        const tz = time_zones.value.find(tz => tz.zones_id == value)?.display;
        return tz;
    }

    const save_voice_settings = () => {
        if(voice_settings.value.time_guard == '1') {
            voice_settings.value.call_window_start = format_date_time(settings.value.settings.call_window_start);
            voice_settings.value.call_window_end = format_date_time(settings.value.settings.call_window_end);
        }

        const dataToSend = {
            'settings': voice_settings.value,
            'cid_confirm': settings.value.user_admin_settings.cid_confirm
        }
        updateVoiceSettings(dataToSend)
    }

    const save_text_settings = () => {
        const dataToSend = {
            'settings': {
                'text_caller_id': settings.value.text_settings.text_caller_id,
                'chat': settings.value.text_settings.chat,
                'sms_dnc': settings.value.text_settings.sms_dnc
            },
        }
        updateTextSettings(dataToSend)
    }

</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .setting-label {
        font-weight: 600;
        margin-right: 6px;
        line-height: 10px;
    }
    .setting-value {
        margin-right: 10px;
        color: blue;
    }
</style>