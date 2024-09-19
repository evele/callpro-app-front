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