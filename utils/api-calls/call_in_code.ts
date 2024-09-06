export type UserCallInCode = {
    id: number;
    call_in_code: number;
    is_static: 0 | 1;
    date: string;
}


export type CallInCodeResponse = {
    result: boolean;
    user_call_in_codes: UserCallInCode[];    
    db_error?:string;
}

export async function getUserCallInCodes():Promise<CallInCodeResponse>{
    const response = await fetchWrapper.get(GET_USER_CALL_IN_CODES_URL)
    return response as CallInCodeResponse
}