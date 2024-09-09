type smsFilters = {
    length_limit: ItemsPerPage,
    search: string,
    start_limit: string,
    state: BroadcastDashboardState
} 


export function getSmsList(data:smsFilters){
    fetchWrapper.post(GET_SMS_DATA_URL, data),
    
}

type fnProps = {
    length_limit: ItemsPerPage,
    load_all: boolean,
    search: string,
    start_limit: string, 
    state: BroadcastDashboardState,
}

type validation_keys = 'length_limit' | 'load_all' | 'search' | 'start_limit' | 'state';

type APIResponseBroadcastList = {
    result: boolean;
    broadcast_list?: BroadcastDashboardData[];
    state?: BroadcastDashboardState;
    total_broadcast?: string;
    db_error?: string;
    validation_error?: Record<validation_keys, string>;
}

export async function getBroadcastList(data: fnProps):Promise<APIResponseBroadcastList> {
    const response = await fetchWrapper.post(GET_BROADCAST_LIST_URL, data)
    return response as APIResponseBroadcastList
}