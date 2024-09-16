type ShowOlderFilter ={
    show_all_audios: boolean,
}

type FilterAudio ={
    audio_id: StringOrNull,
    audio_full_url: StringOrNull,
    called_from:string
}

type APIResponseConvertedAudios = {
    result: boolean,
    audios: AudioAux[],
}
type APIResponseAllAudios = {
    result: boolean,
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