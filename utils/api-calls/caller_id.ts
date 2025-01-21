/* ----- Get caller id numbers ----- */
export async function getCallerIDNumbers(): Promise<CallerIDFetchAPIRsponse | APIResponseError>{    
    return await fetchWrapper.get(GET_CALLER_ID_NUMBERS_URL) as CallerIDFetchAPIRsponse | APIResponseError
}

type saveCallerIDNumberResponseSuccess = APIResponseSuccess & {
    success_message: string;
}

type CallerIDToSave = {
    caller_id: string;
}

/* ----- Save caller id number ----- */
export async function saveCallerIDNumber(data: CallerIDToSave): Promise<saveCallerIDNumberResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(SAVE_CALLER_ID_NUMBER_URL, data) as saveCallerIDNumberResponseSuccess | APIResponseError
}

/* ----- Verify caller id number ----- */
export async function verifyCallerIDNumber(data: CallerIDToVerify): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(VERIFY_CALLER_ID_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Delete caller id number ----- */
export async function deleteCallerIDNumber(data: CallerIDToDelete): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(DELETE_CALLER_ID_NUMBER_URL, data) as APIResponseSuccess | APIResponseError
}