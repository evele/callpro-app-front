
type ShowOlderFilter ={
    show_all_audios: boolean,
}

interface APIResponse{
    result: boolean,
    audios?: Audio[],
    error?: string|null
}

// tyope // audio_id
//         $this->form_validation->set_rules('broadcast_id', 'Broadcast ID', 'integer');
//         $this->form_validation->set_rules('audio_full_url', 'Audio URL', 'required|trim');
//         $this->form_validation->set_rules('called_from', 'Called from', 'required|trim');

export async function getUserAllAudios(data:ShowOlderFilter):Promise<APIResponse> {
    const response = await fetchWrapper.post(GET_AUDIOS_URL, data)     
    return response as APIResponse
}

//enabled: false,
export async function getUserConvertedAudios(data:Audio):Promise<APIResponse> {
    const response = await fetchWrapper.post(GET_AUDIO_URL, data)
    return response as APIResponse
}