type fnProps = {
    length_limit: ItemsPerPage,
    load_all: boolean,
    search: string,
    start_limit: string, 
    state: DashboardState,
}

type APIResponseBroadcastList = {
    result: true;
    broadcast_list: BroadcastDashboardData[];
    state: DashboardState;
    total_broadcast: string;    
}

export async function getBroadcastList(data: fnProps):Promise<APIResponseBroadcastList | APIResponseError> {
    return await fetchWrapper.post(GET_BROADCAST_LIST_URL, data) as APIResponseBroadcastList | APIResponseError
}