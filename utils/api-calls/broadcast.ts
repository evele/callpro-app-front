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
type GetBroadcastResponse = APIResponseSuccess & { 
    broadcast_data: { broadcast: Broadcast } | null 
}

export async function getBroadcast(data: BroadcastIdParams):Promise<GetBroadcastResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_URL, data) as GetBroadcastResponse | APIResponseError
}

/* ----- Delete Draft ----- */
export async function deleteDraft(data: BroadcastIdParams):Promise<APIResponseSuccess | APIResponseError>{
    return await fetchWrapper.post(DELETE_DRAFT_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Get total monthly numbers ----- */
type GetTotalMonthlyNumbersParams = BroadcastIdParams & { 
    tts_merge_enable: ZeroOrOne
}
type GetTotalMonthlyNumbersResponse = APIResponseSuccess & TotalMonthlyNumbersData

export async function getTotalMonthlyNumbers(data: GetTotalMonthlyNumbersParams):Promise<GetTotalMonthlyNumbersResponse | APIResponseError>{
    return await fetchWrapper.post(GET_TOTAL_MONTHLY_NUMBERS_URL, data) as GetTotalMonthlyNumbersResponse | APIResponseError
}

/* ----- Save selected numbers contact ----- */
type SaveSelectedNumbersContactParams = BroadcastIdParams & { 
    numbers: string[]
}

export async function saveSelectedNumbersContact(data: SaveSelectedNumbersContactParams):Promise<APIResponseSuccess | APIResponseError>{
    return await fetchWrapper.post(SAVE_SELECTED_NUMBERS_CONTACT_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Delete selected numbers contact ----- */
type DeleteSelectedNumbersContactParams = BroadcastIdParams & { 
    number_to_delete: string
}

export async function deleteSelectedNumbersContact(data: DeleteSelectedNumbersContactParams):Promise<APIResponseSuccess | APIResponseError>{
    return await fetchWrapper.post(DELETE_SELECTED_NUMBERS_CONTACT_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Get group numbers selected ----- */
type GetGroupNumbersSelectedResponse = APIResponseSuccess & { groups_selected: GroupSelected[] }

export async function getGroupNumbersSelected(data: BroadcastIdParams):Promise<GetGroupNumbersSelectedResponse | APIResponseError>{
    return await fetchWrapper.post(GROUP_NUMBERS_SELECTED_URL, data) as GetGroupNumbersSelectedResponse | APIResponseError
}

/* ----- Get all contacts and groups ----- */
type GetAllContactsAndGroupsResponse = APIResponseSuccess & UserGroup[]

export async function getAllContactsAndGroups():Promise<GetAllContactsAndGroupsResponse | APIResponseError>{
    return await fetchWrapper.get(GET_ALL_CONTACTS_AND_GROUPS_URL) as GetAllContactsAndGroupsResponse | APIResponseError
}

/* ----- Get all contacts and groups ----- */
export async function saveSelectedGroup(data: SaveSelectedGroupParams):Promise<APIResponseSuccess | APIResponseError>{
    return await fetchWrapper.post(SAVE_SELECTED_GROUP_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Get broadcast selected numbers ----- */
type GetBSNParams = BroadcastIdParams & {
    tts_merge_enable: ZeroOrOne
}

export async function getBroadcastSelectedNumbers(data: GetBSNParams):Promise<GetBSNResponse | APIResponseError>{
    return await fetchWrapper.post(GET_BROADCAST_SELECTED_NUMBERS_URL, data) as GetBSNResponse | APIResponseError
}

/* ----- Get credits needed ----- */
type GetCreditsNeededParams = BroadcastIdParams & {
    tts_merge_enable: ZeroOrOne
}
type GetCreditsNeededResponse = APIResponseSuccess & { 
    remaining: number
    total_price: number 
}

export async function getCreditsNeeded(data: GetCreditsNeededParams):Promise<GetCreditsNeededResponse | APIResponseError>{
    return await fetchWrapper.post(GET_CREDITS_NEEDED_URL, data) as GetCreditsNeededResponse | APIResponseError
}