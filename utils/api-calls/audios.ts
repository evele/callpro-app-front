type ShowOlderFilter ={
    show_all_audios: boolean,
}

type FilterAudio ={
    audio_id: StringOrNull,
    audio_full_url: StringOrNull,
    called_from:string
}

type APIResponseConvertedAudios = {
    result: true,
    audios: AudioAux[],
}
type APIResponseAllAudios = {
    result: true,
    audios: Audio[],
    has_older_audios?:boolean,
}

export async function getUserAllAudios(data:ShowOlderFilter):Promise<APIResponseAllAudios | APIResponseError> {    
    return await fetchWrapper.post(GET_AUDIOS_URL, data) as APIResponseAllAudios | APIResponseError;
}

//enabled: false,
export async function getUserConvertedAudios(data:FilterAudio):Promise<APIResponseConvertedAudios | APIResponseError> { 
    return await fetchWrapper.post(GET_AUDIO_URL, data) as APIResponseConvertedAudios | APIResponseError;
}

/* ----- Save Audio ----- */
export async function saveAudio(data:AudioToSave):Promise<{ result: true } | APIResponseError> {
    return await fetchWrapper.post(SAVE_AUDIO_URL, data) as { result: true } | APIResponseError;
}

/* ----- Save Audio ----- */
export async function deleteAudio(data:AudioToDelete):Promise<{ result: true } | APIResponseError> {
    return await fetchWrapper.post(DELETE_AUDIO_URL, data) as { result: true } | APIResponseError;
}