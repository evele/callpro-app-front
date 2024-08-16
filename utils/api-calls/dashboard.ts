type State = 'COMPLETED' | 'ACTIVE' | 'DRAFT'

type fnProps = {
    // length_limit: '10' | '25' | '50' | '100',
    length_limit: string,
    load_all: boolean,
    search: string,
    start_limit: string, 
    state: string,
}

type validation_keys = 'length_limit' | 'load_all' | 'search' | 'start_limit' | 'state'

interface APIResponseBroadcastList {
    result: boolean;
    broadcast_list?: BroadcastDashboardData[];
    state?: State;
    total_broadcast?: string;
    db_error?: string;
    validation_error?: Record<validation_keys, string>;
}

export async function getBroadcastList(data: fnProps):Promise<APIResponseBroadcastList> {
    const response = await fetchWrapper.post(GET_BROADCAST_LIST_URL, data)
    return response as APIResponseBroadcastList
}