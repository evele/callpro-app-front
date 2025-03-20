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
type SaveBroadcastDraftResponse = APIResponseSuccess & { draft_id: number }

export async function saveBroadcastDraft(data: DraftToSave):Promise<SaveBroadcastDraftResponse | APIResponseError>{
    return await fetchWrapper.post(SAVE_BROADCAST_DRAFT_URL, data) as SaveBroadcastDraftResponse | APIResponseError
}

/* ----- Get last draft ID ----- */
type GetLastDraftIdResponse = APIResponseSuccess & { draft_id: NumberOrNull }

export async function getLastDraftID():Promise<GetLastDraftIdResponse | APIResponseError>{
    return await fetchWrapper.get(GET_LAST_DRAFT_ID_URL) as GetLastDraftIdResponse | APIResponseError
}

/* ----- Get Broadcast ----- */
type GetBroadcastParams = { broadcast_id: number }
type GetBroadcastResponse = APIResponseSuccess & { 
    broadcast_data: { broadcast: Broadcast } | null 
}

export async function getBroadcast(data: GetBroadcastParams):Promise<GetBroadcastResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_URL, data) as GetBroadcastResponse | APIResponseError
}

/* ----- Delete Draft ----- */
type DeleteDraftParams = { broadcast_id: number }

export async function deleteDraft(data: DeleteDraftParams):Promise<APIResponseSuccess | APIResponseError>{
    return await fetchWrapper.post(DELETE_DRAFT_URL, data) as APIResponseSuccess | APIResponseError
}