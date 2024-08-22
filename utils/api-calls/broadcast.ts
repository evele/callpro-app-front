export type Broadcast = {
    user_id: string;
    broadcast_id: string;
    status: string;
    name: string;
    library_id: string | null;
    file_name: string | null;
    audio_name: string | null;
    caller_id: string;
    static_intro_library_id: string | null;
    repeat: string;
    offer_dnc: string;
    retries: string;
    call_speed: string;
    amd_detection: string;
    email_on_finish: string;
    number_when_completed: string;
    created_at: string;
    start_time: string;
    started_at: string | null;
    ended_at: string | null;
    feedback: string;
    duration: string | null;
    PENDING: string;
    ACTIVE: string;
    LIVE: string;
    VM: string;
    NA: string;
    TRANSFERRED: string;
    INVALID: string;
}

export type BroadcastResponse = {
result: boolean;
broadcast: Array<{ id: number; name: string }>;
db_error?: { broadcast_id?: string };
}
export type StateOption = 'ALL' | 'LIVE'| 'VM'| 'INVALID'| 'NA';

export type StatusOption = 'COMPLETED' | 'PROCESSING' | 'SCHEDULED' | 'CALLING' | 'TRANSFERRED' | 'PAUSED' |'CONNECTED'| 'WAITING_FOR_RETRY';    

export type BroadcastDetailParams = {
    broadcast_id: string;
    length_limit:number;
    search: string;
    start_limit:number;
    state: StateOption;
  }

export type BroadcastDetails ={
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
	feedback: string | null;
	started_at: string| null;
	ended_at:  string| null;
	transfer_duration:  string| null;
}

export type BroadcastDetailResponse = {
    result: boolean;
    results_count: number;
    broadcast_details: BroadcastDetails[];//Array<{ id: number; broadcast_id: number; result: string; duration: string }>;
    state: StateOption;
    db_error?: { broadcast_id?: string };
  }