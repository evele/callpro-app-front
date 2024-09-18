/* ----- Get settings ----- */
type SettingsAPIResponse = {
    result: true,
    monthly_groups_plans: MonthlyGroupPlan[],
    max_retries: number | null,
    static_intro_enabled?: boolean | null,
    settings: Settings,
    text_settings: TextSettings,
    timezones: Timezone[],
    user_admin_settings: UserAdminSettings
}

export async function getSettings(): Promise<SettingsAPIResponse | APIResponseError>{    
    return await fetchWrapper.get(GET_SETTINGS_DATA_URL) as SettingsAPIResponse | APIResponseError
}

/* ----- Update voice settings ----- */
type update_voice_settings_validation_fields = 
    'caller_id' |
    'static_intro' |
    'static_intro_library_id' |
    'repeat' |
    'offer_dnc' |
    'retries' |
    'call_speed' |
    'amd_detection' |
    'email_on_finish' |
    'number_when_completed_status' |
    'number_when_completed' |
    'time_guard' |
    'call_window_start' |
    'call_window_end' |
    'time_zone';
    
type update_voice_settings_validation_keys = 'cid_confirm' | `settings[${update_voice_settings_validation_fields}]`;

type UpdateVoiceSettingsAPIResponse = {
    result: true;
    validation_error? : Record<update_voice_settings_validation_keys, string>    
}

export async function updateVoiceSettings(data: VoiceSettingsDataToSave): Promise<UpdateVoiceSettingsAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(UPDATE_VOICE_SETTINGS_URL, data) as UpdateVoiceSettingsAPIResponse | APIResponseError
}

/* ----- Update text settings ----- */
type update_text_settings_validation_fields = 'text_caller_id' | 'chat' | 'sms_dnc';
    
type update_text_settings_validation_keys = `settings[${update_text_settings_validation_fields}]`;

type UpdateTextSettingsAPIResponse = {
    result: true;
    validation_error: Record<update_text_settings_validation_keys, string>    
}

export async function updateTextSettings(data: TextSettingsDataToSave): Promise<UpdateTextSettingsAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(UPDATE_TEXT_SETTINGS_URL, data) as UpdateTextSettingsAPIResponse | APIResponseError
}