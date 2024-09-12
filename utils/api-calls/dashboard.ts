type fnProps = {
    length_limit: ItemsPerPage,
    load_all: boolean,
    search: string,
    start_limit: string, 
    state: DashboardState,
}

type validation_keys = 'length_limit' | 'load_all' | 'search' | 'start_limit' | 'state';

type APIResponseBroadcastList = {
    result: boolean;
    broadcast_list?: BroadcastDashboardData[];
    state?: DashboardState;
    total_broadcast?: string;
    db_error?: string;
    validation_error?: Record<validation_keys, string>;
}

export async function getBroadcastList(data: fnProps):Promise<APIResponseBroadcastList> {
    const response = await fetchWrapper.post(GET_BROADCAST_LIST_URL, data)
    return response as APIResponseBroadcastList
}