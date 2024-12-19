type UserCallInCode = {
    id: number;
    call_in_code: number;
    is_static: ZeroOrOne;
    date: string;
}

type CallInCodeResponse = {
    result: true;
    user_call_in_codes: UserCallInCode[];        
}

export async function getUserCallInCodes():Promise<CallInCodeResponse | APIResponseError>{
    return await fetchWrapper.get(GET_USER_CALL_IN_CODES_URL) as CallInCodeResponse | APIResponseError
}

type CallInCodeData = {
    is_static: ZeroOrOne
}

export async function createCallInCode(data: CallInCodeData):Promise<CreateCallInCodeResponse | APIResponseError>{
    return await fetchWrapper.post(CREATE_CALL_IN_CODE_URL,data) as CreateCallInCodeResponse | APIResponseError
}

type CallInCodeToDelete = {
    call_in_code_id: number
}

export async function deleteCallInCode(data: CallInCodeToDelete):Promise<APIResponseSuccess | APIResponseError>{
    return await fetchWrapper.post(DELETE_CALL_IN_CODE_URL,data) as CallInCodeResponse | APIResponseError
}