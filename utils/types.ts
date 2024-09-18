export type ItemsPerPage = 10 | 25 | 50 | 100;
export type ItemsPerPageOption = { name: string; code: ItemsPerPage };
export type DashboardState = typeof COMPLETED | typeof ACTIVE | typeof DRAFT;
export type ZeroOrOne = '0' | '1';
export type OneOrTwo = '1' | '2';
export type OneToFour = '1' | '2' | '3' | '4';
export type OneToNine = OneToFour | '5' | '6' | '7' | '8' | '9';
export type CallSpeed = 5 | 20 | 50 | 100 | 200 | 999;
export type SelectOption = { name: string; code: string | number };
export type StringOrNumber = string | number;
export type StringOrNull = string | null;
export type NumberOrNull = number | null;
export type BooleanOrNull = boolean | null;
export type StringOrNumberOrNull = string | number | null;
export type StateOption = 'ALL' | 'LIVE'| 'VM'| 'INVALID'| 'NA';


export type APIResponseError = {
  result: false,
  error?:string,
  validation_error?: Record<string, string>
}

// Interface for a phone number and its associated groups
export type PhoneNumber = {
  number_id: string; // Unique identifier for the number
  number: string; // The phone number itself
  notes: string; // Notes associated with the number
  dnc: ZeroOrOne; // Do Not Call status
  type: OneToFour; // Type of the number
  number_groups: string[]; // Array of group identifiers the number belongs to
  in_trash: ZeroOrOne; // Indicates if the number is in trash
}
  
// Interface for a contact
export type Contact = {
  id: string; // Unique identifier for the contact
  first_name: string; // First name of the contact
  last_name: string; // Last name of the contact
  numbers: PhoneNumber[]; // Array of phone numbers associated with the contact
}

export type ContactPhoneNumber = PhoneNumber & {
  id: number;
  first_name: string;
  last_name: string;
  is_deleted: ZeroOrOne;
}

// Type for Group Contacts
export type ContactGroup = {
  name: string;
  id: number | null;
  phone_launch_id: number | null;
};

export type ContactToSave = {
  first_name: string,
  last_name: string,
  numbers: {
      id: 'new' | number,
      number: string,
      notes: string,
      type: OneToFour,
      number_groups: string[] | null
  }[]
}

export type ContactToSaveData = {
  action: 'create' | 'update',
  contact_info: ContactToSave,
  save_contact: boolean
}

export type ContactUploadedData = {
  contact_id: number;
  first_name: string;
  last_name: string;
  valid: boolean;
  validation_desc: string;
  numbers: {
    notes: string;
    number: number;
    number_groups: string[];
    type: OneToFour;
    valid: boolean;
    validation_desc: string;
    number_id: -1;
    in_trash: 0;
    dnc: 0;
  }[];
}

export type uploadedContactToSave = {
  first_name: string;
  last_name: string;
  number: number;
  contact_id: string;
};

export type uploadedContactToSaveData = {
  contacts: uploadedContactToSave[];
  group_id: string;
}

export type UserCustomGroup = {
  audio_name: string | null,
  group_code: number | '',
  group_name: string,
  id: number,
  root_user_id: number,
}

export type CallerID = {
  id: string;
  caller_id: string;
  status: 'PENDING' | 'CONFIRMED' | 'UNVERIFIED' | 'REJECTED';
  user_id: string;
}

export type BroadcastDashboardData ={
  ACTIVE: number;
  INVALID: number;
  LIVE: number;
  NA: number;
  PENDING: number;
  TRANSFERRED: number;
  VM: number;
  amd_detection: ZeroOrOne;
  audio_name: string;
  broadcast_id: number;
  call_speed: CallSpeed;
  caller_id: string;
  created_at: string;
  duration: string;
  email_on_finish: ZeroOrOne;
  ended_at: string;
  feedback: ZeroOrOne;
  file_name: string;
  library_id: string;
  name: string;
  number_when_completed: string;
  offer_dnc: ZeroOrOne;
  repeat: ZeroOrOne;
  retries: '1' | '2' | '3' | '4';
  start_time: string;
  started_at: string;
  static_intro_library_id: string | null;
  status: string; //TODO: ASK FOR ALL POSSIBLE VALUES TO AVOID STRING
  user_id: number;
}

export type SMSDashboardData = {
  user_id: number,
  sms_id: number,
  status: DashboardState,
  name: string,
  text: string,
  did: string,
  created_at: string,
  start_time: string,
  started_at: StringOrNull,
  ended_at: StringOrNull,
  duration: NumberOrNull,
  PENDING: number,
  SENDING: number,
  SUCCESFULL: number,
  INVALID: number
}

/* ----- Did numbers ----- */
export type DidNumber = {
  id: number;
  number: string;
  cnam: StringOrNull;
  created_at: string;
  order_id: string;
  root_user_id: number;
  status: 'CONFIRMED' | 'ORDERED';
  toll_free: ZeroOrOne;
}

/* ----- Groups ----- */
export type SystemGroup = {
  not_trash: number;
  trash: number;
  unassigned: number;
}

export type CustomGroup = {
  id: number;
  group_code: string | number | null;
  group_name: string | number;
  count: number;
}

/* ----- Packages ----- */
export type PackageStep = {
  package_id: number;
  price: number;
  price_cents: number;
  regular_price: number;
  total: number;
  floor: number;
}

export type MonthlyGroupPlan = {
  id: number;
  ivr_input: number | null;
  name: number | string;
  numbers: number;
  price: number;
  public: ZeroOrOne;
  status: ZeroOrOne;
  term: number;
}

/* ----- Settings ----- */
export type Zones = 
  | 'America/Moncton'
  | 'America/New_York'
  | 'America/Chicago'
  | 'America/Edmonton'
  | 'America/Los_Angeles'
  | 'America/Los_Angeles'
  | 'America/Anchorage'
  | 'America/Adak'
  | 'Europe/London'

export type Timezone = {
  zones_id: OneToNine;
  zone: Zones;
  offset: string;
  display: string;
  country_initials: 'CA' | 'US' | 'UK';
}

export type Settings = {
  amd_detection: ZeroOrOne;
  call_speed: CallSpeed;
  call_window_end: string;
  call_window_start: string;
  caller_id: string;
  chat: ZeroOrOne;
  email_on_finish: ZeroOrOne;
  number_when_completed: string;
  number_when_completed_status: ZeroOrOne;
  offer_dnc: ZeroOrOne;
  opt: ZeroOrOne;
  repeat: ZeroOrOne;
  repeat_audio: 'system' | 'library' | 'broadcast' | null;
  repeat_library_id: number | null;
  retries: '1' | '2' | '3' | '4';
  root_user_id: number;
  static_intro: ZeroOrOne;
  static_intro_library_id: number | null;
  text_caller_id: string;
  time_guard: ZeroOrOne;
  time_zone: OneToNine;
}

export type TextSettings = {
  chat: ZeroOrOne;
  root_user_id: number;
  sms_dnc: ZeroOrOne;
  text_caller_id: string;
}

export type UserAdminSettings = {
  cid_confirm: ZeroOrOne;
  enable_download: ZeroOrOne;
  id: number;
  length_per_credit: number;
  length_per_message: number;
  length_per_sms: number;
  messages_per_month: number;
  ptc_price: number;
  root_user_id: number;
  sms_enabled: ZeroOrOne;
  sms_price: number;
  special_monthly_credits_id: number | null;
  special_monthly_groups_id: number | null;
  special_paug_id: number;
  voice_price: number;
}

export type VoiceSettingsToSave = {
  caller_id: string;
  static_intro: ZeroOrOne;
  static_intro_library_id: number | null;
  repeat: ZeroOrOne;
  repeat_audio: 'system' | 'library' | 'broadcast' | null;
  repeat_library_id: number | null;
  offer_dnc: ZeroOrOne;
  retries: '1' | '2' | '3' | '4';
  call_speed: CallSpeed;
  amd_detection: ZeroOrOne,
  email_on_finish: ZeroOrOne;
  number_when_completed: string;
  number_when_completed_status: ZeroOrOne;
  time_guard: ZeroOrOne;
  time_zone: OneToNine;
  call_window_start: string;
  call_window_end: string;
}

export type VoiceSettingsDataToSave = {
  settings: VoiceSettingsToSave;
  cid_confirm: ZeroOrOne;
}

export type TextSettingsDataToSave = {
  settings: {
    text_caller_id: string;
    chat: ZeroOrOne;
    sms_dnc: ZeroOrOne;
  }
}

export type Tts_Convert = {
  full_file_url:string,
  file_name: string
}
// TODO: Ver Audio y AudioAUX para extender o algo similar
export type Audio = {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  last_used: string;
  file_name: string;
  length: number;
  is_delete: "N" | "Y";
  full_file_url: string;
}

export type AudioAux = {
  id: string;
  audio_id: StringOrNull;
  audio_url: StringOrNull;
  name: string;
  created_at: string;
  last_used: string;
  file_name: string;
  length: string;
  is_delete: string;
  full_file_url: string;
}

export type TextToConvert = {
  text: string, 
  temp: boolean    
}