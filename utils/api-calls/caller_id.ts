type APIResponseCID = {
    result: true;
    caller_ids: CallerID[];    
}

export async function getCallerID():Promise<APIResponseCID | APIResponseError>{    
    return await fetchWrapper.get(GET_CALLER_IDS_URL) as APIResponseCID | APIResponseError
}
