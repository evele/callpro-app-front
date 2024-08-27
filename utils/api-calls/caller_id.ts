type APIResponseCID = {
    result: boolean;
    caller_ids?: CallerID[];
    db_error?: string;
}

export async function getCallerID():Promise<APIResponseCID>{
    const response = await fetchWrapper.get(GET_CALLER_IDS_URL)
    return response as APIResponseCID
}
