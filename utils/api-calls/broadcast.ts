type BroadcastResponse = {
result: true;
broadcast: Array<{ id: number; name: string }>;
}

type StatusOption = 'COMPLETED' | 'PROCESSING' | 'SCHEDULED' | 'CALLING' | 'TRANSFERRED' | 'PAUSED' |'CONNECTED'| 'WAITING_FOR_RETRY';    

type BroadcastDetailParams = {
    broadcast_id: number;
    length_limit:number;
    search: string;
    start_limit:number;
    state: StateOption;
  }

type BroadcastDetails ={
    id: number; 
    broadcast_id: number;
    last_name:string;
	first_name:string;
	contact_phone_number: number;
	status: StatusOption;
    result: StateOption;
    duration: number;			
    group:StateOption;
	attempts: number;//"1"?
	feedback: StringOrNull;
	started_at: StringOrNull;
	ended_at:  StringOrNull;
	transfer_duration:  StringOrNull;
}


type BroadcastDetailResponse = {
    result: true;
    results_count: number;
    broadcast_details: BroadcastDetails[];
    state: StateOption;    
  }

export async function getBroadcastHeader(data:{ broadcast_id: number }):Promise<BroadcastResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_HEADER_URL,data) as BroadcastResponse | APIResponseError
}

export async function getBroadcastDetail(data:BroadcastDetailParams):Promise<BroadcastDetailResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_DETAIL_URL, data) as BroadcastDetailResponse | APIResponseError
}