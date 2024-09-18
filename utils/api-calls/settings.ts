/* ----- Get settings ----- */
type SettingsAPIResponse = {
    result: true,
    monthly_groups_plans: MonthlyGroupPlan[],
    max_retries: NumberOrNull,
    static_intro_enabled: BooleanOrNull,
    settings: Settings,
    text_settings: TextSettings,
    timezones: Timezone[],
    user_admin_settings: UserAdminSettings
}

export async function getSettings(): Promise<SettingsAPIResponse | APIResponseError>{    
    return await fetchWrapper.get(GET_SETTINGS_DATA_URL) as SettingsAPIResponse | APIResponseError
}

/* ----- Update voice settings ----- */
type UpdateVoiceSettingsAPIResponse = {
    result: true;
}

export async function updateVoiceSettings(data: VoiceSettingsDataToSave): Promise<UpdateVoiceSettingsAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(UPDATE_VOICE_SETTINGS_URL, data) as UpdateVoiceSettingsAPIResponse | APIResponseError
}

/* ----- Update text settings ----- */
type UpdateTextSettingsAPIResponse = {
    result: true;       
}

export async function updateTextSettings(data: TextSettingsDataToSave): Promise<UpdateTextSettingsAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(UPDATE_TEXT_SETTINGS_URL, data) as UpdateTextSettingsAPIResponse | APIResponseError
}