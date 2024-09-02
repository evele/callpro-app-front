
type ShowOlderFilter ={
    show_all_audios: boolean,
}

type FilterAudio ={
    audio_id: string | null, 
    audio_full_url: string | null,
    called_from:string
}

//TODO no cambie el nombre perdon
export type TextToConvert = {
    text: string, 
    temp: boolean    
  }

type APIResponseConvertedAudios = {
    result: boolean,
    audios?: AudioAux[],
    db_error?: string,    
}
type APIResponseAllAudios = {
    result: boolean,
    audios?: Audio[],
    has_older_audios?:boolean,
    db_error?: string,
    validation_error?: Record<validation_keys,string>
}


export async function getUserAllAudios(data:ShowOlderFilter):Promise<APIResponseAllAudios> {
    const response = await fetchWrapper.post(GET_AUDIOS_URL, data)     
    return response as APIResponseAllAudios
}

type validation_keys = 'audio_id' | 'broadcast_id' | 'audio_full_url' | 'called_from'

//enabled: false,
export async function getUserConvertedAudios(data:FilterAudio):Promise<APIResponseConvertedAudios> {
    const response = await fetchWrapper.post(GET_AUDIO_URL, data)
    return response as APIResponseConvertedAudios
}