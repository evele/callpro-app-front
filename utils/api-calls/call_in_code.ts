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
