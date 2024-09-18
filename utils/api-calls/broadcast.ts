type Broadcast = {
    user_id: string;
    broadcast_id: string;
    status: string;
    name: string;
    library_id: StringOrNull;
    file_name: StringOrNull;
    audio_name: StringOrNull;
    caller_id: string;
    static_intro_library_id: StringOrNull;
    repeat: string;
    offer_dnc: string;
    retries: string;
    call_speed: string;
    amd_detection: string;
    email_on_finish: string;
    number_when_completed: string;
    created_at: string;
    start_time: string;
    started_at: StringOrNull;
    ended_at: StringOrNull;
    feedback: string;
    duration: StringOrNull;
    PENDING: string;
    ACTIVE: string;
    LIVE: string;
    VM: string;
    NA: string;
    TRANSFERRED: string;
    INVALID: string;
}

type BroadcastResponse = {
result: true;
broadcast: Array<{ id: number; name: string }>;
}

type StatusOption = 'COMPLETED' | 'PROCESSING' | 'SCHEDULED' | 'CALLING' | 'TRANSFERRED' | 'PAUSED' |'CONNECTED'| 'WAITING_FOR_RETRY';    

type BroadcastDetailParams = {
    broadcast_id: string;
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

export async function getBroadcastHeader(data:{ broadcast_id: string }):Promise<BroadcastResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_HEADER_URL,data) as BroadcastResponse | APIResponseError
}

export async function getBroadcastDetail(data:BroadcastDetailParams):Promise<BroadcastDetailResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_DETAIL_URL, data) as BroadcastDetailResponse | APIResponseError
}