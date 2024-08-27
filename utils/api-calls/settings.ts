/* ----- Get settings ----- */
type SettingsAPIResponse = {
    result: boolean,
    monthly_groups_plans?: MonthlyGroupPlan[],
    max_retries?: number | null,
    static_intro_enabled?: boolean | null,
    settings?: Settings,
    text_settings?: TextSettings,
    timezones?: Timezone[],
    user_admin_settings?: UserAdminSettings
}

export async function getSettings(): Promise<SettingsAPIResponse>{
    const response = await fetchWrapper.get(GET_SETTINGS_DATA_URL) 
    return response as SettingsAPIResponse
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
    result: boolean;
    validation_error? : Record<update_voice_settings_validation_keys, string>
    db_error?: string
}

export async function updateVoiceSettings(data: VoiceSettingsDataToSave): Promise<UpdateVoiceSettingsAPIResponse>{
    const response = await fetchWrapper.post(UPDATE_VOICE_SETTINGS_URL, data) 
    return response as UpdateVoiceSettingsAPIResponse
}

/* ----- Update text settings ----- */
type update_text_settings_validation_fields = 'text_caller_id' | 'chat' | 'sms_dnc';
    
type update_text_settings_validation_keys = `settings[${update_text_settings_validation_fields}]`;

type UpdateTextSettingsAPIResponse = {
    result: boolean;
    validation_error?: Record<update_text_settings_validation_keys, string>
    db_error?: string
}

export async function updateTextSettings(data: TextSettingsDataToSave): Promise<UpdateTextSettingsAPIResponse>{
    const response = await fetchWrapper.post(UPDATE_TEXT_SETTINGS_URL, data) 
    return response as UpdateTextSettingsAPIResponse
}