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

type CheckSelectedStartTimeParams = {
    time_to_check: string;
}

type CheckSelectedStartTimeResponse = APIResponseSuccess & {
    check: boolean;
    next_month: boolean;
    suggested_start: string;
    time: number;
}

export async function checkSelectedStartTime(data: CheckSelectedStartTimeParams):Promise<CheckSelectedStartTimeResponse | APIResponseError>{
    return await fetchWrapper.post(CHECK_SELECTED_START_TIME_URL, data) as CheckSelectedStartTimeResponse | APIResponseError
}

/* ----- Broadcast Draft ----- */
type saveBroadcastDraftResponse = APIResponseSuccess & { draft_id: number }

export async function saveBroadcastDraft(data: DraftToSave):Promise<saveBroadcastDraftResponse | APIResponseError>{
    return await fetchWrapper.post(SAVE_BROADCAST_DRAFT_URL, data) as saveBroadcastDraftResponse | APIResponseError
}

/* ----- Get last draft ID ----- */
type getLastDraftIdResponse = APIResponseSuccess & { draft_id: NumberOrNull }

export async function getLastDraftID():Promise<getLastDraftIdResponse | APIResponseError>{
    return await fetchWrapper.get(GET_LAST_DRAFT_ID_URL) as getLastDraftIdResponse | APIResponseError
}

/* ----- Get Broadcast ----- */
type getBroadcastParams = { broadcast_id: number }
type getBroadcastResponse = APIResponseSuccess & { 
    broadcast_data: { broadcast: Broadcast } | null 
}

export async function getBroadcast(data: getBroadcastParams):Promise<getBroadcastResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_URL, data) as getBroadcastResponse | APIResponseError
}