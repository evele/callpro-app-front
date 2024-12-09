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
export async function saveAudio(data:AudioToSave):Promise<APIResponseSuccess | APIResponseError> {
    return await fetchWrapper.post(SAVE_AUDIO_URL, data) as APIResponseSuccess | APIResponseError;
}

/* ----- Save Audio ----- */
export async function deleteAudio(data:AudioToDelete):Promise<APIResponseSuccess | APIResponseError> {
    return await fetchWrapper.post(DELETE_AUDIO_URL, data) as APIResponseSuccess | APIResponseError;
}

/* ----- Download Audio ----- */
type AudioToDownload = {
    file_name: string
}

export async function downloadAudio(file_name: AudioToDownload):Promise<boolean> {
    try {
        const response = await fetchWrapper.post(DOWNLOAD_AUDIO_URL, file_name);

        if (response instanceof Blob) {
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file_name.file_name);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            return false
        }
    } catch (error) {
        return false
    }
    return true
}