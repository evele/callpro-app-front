type smsFilters = {
    length_limit: ItemsPerPage,
    search: string,
    start_limit: string,
    state: DashboardState
} 

type APIResponseSmsList = {
    result: boolean,
    sms_list: SMSDashboardData[],
    state: DashboardState,
    total_sms: string
}

export async function getSmsList(data:smsFilters):Promise<APIResponseSmsList | APIResponseError>{
    return await fetchWrapper.post(GET_SMS_DATA_URL, data) as APIResponseSmsList | APIResponseError
}