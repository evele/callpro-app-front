/* ----- Get settings ----- */
type SettingsAPIResponse = {
    result: true,
    monthly_groups_plans: MonthlyGroupPlan[],
    max_retries: NumberOrNull,
    static_intro_enabled: BooleanOrNull,
    settings: Settings,
    text_settings: TextSettings,    
    user_admin_settings: UserAdminSettings
    static_intro_audio_selected: Audio | false 
}

export async function getSettings(): Promise<SettingsAPIResponse | APIResponseError>{    
    return await fetchWrapper.get(GET_SETTINGS_DATA_URL) as SettingsAPIResponse | APIResponseError
}

/* ----- Update voice settings ----- */
export async function updateVoiceSettings(data: VoiceSettingsDataToSave): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(UPDATE_VOICE_SETTINGS_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Update text settings ----- */
export async function updateTextSettings(data: TextSettingsDataToSave): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(UPDATE_TEXT_SETTINGS_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Update general settings ----- */
export async function updateGeneralSettings(data: GeneralSettingsDataToSave): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(UPDATE_GENERAL_SETTINGS_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Get caller id numbers ----- */
export async function getCallerIDNumbers(): Promise<CallerIDFetchAPIRsponse | APIResponseError>{    
    return await fetchWrapper.get(GET_CALLER_ID_NUMBERS_URL) as CallerIDFetchAPIRsponse | APIResponseError
}