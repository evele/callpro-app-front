export type ItemsPerPage = 10 | 25 | 50 | 100;
export type ItemsPerPageOption = { name: string; code: ItemsPerPage };
export type BroadcastDashboardState = typeof COMPLETED | typeof ACTIVE | typeof DRAFT;
export type CeroOrOne = '0' | '1';
export type ContactType = '1' | '2' | '3' | '4';

// Interface for a phone number and its associated groups
export type PhoneNumber = {
  number_id: string; // Unique identifier for the number
  number: string; // The phone number itself
  notes: string; // Notes associated with the number
  dnc: CeroOrOne; // Do Not Call status
  type: ContactType; // Type of the number
  number_groups: string[]; // Array of group identifiers the number belongs to
  in_trash: CeroOrOne; // Indicates if the number is in trash
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
  is_deleted: CeroOrOne;
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
      type: ContactType,
      number_groups: string[] | null
  }[]
}

export type ContactToSaveData = {
  action: 'create' | 'update',
  contact_info: ContactToSave,
  save_contact: boolean
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
  ACTIVE: string;
  INVALID: string;
  LIVE: string;
  NA: string;
  PENDING: string;
  TRANSFERRED: string;
  VM: string;
  amd_detection: CeroOrOne;
  audio_name: string;
  broadcast_id: string;
  call_speed: string;
  caller_id: string;
  created_at: string;
  duration: string;
  email_on_finish: CeroOrOne;
  ended_at: string;
  feedback: CeroOrOne;
  file_name: string;
  library_id: string;
  name: string;
  number_when_completed: string;
  offer_dnc: CeroOrOne;
  repeat: CeroOrOne;
  retries: '1' | '2' | '3' | '4';
  start_time: string;
  started_at: string;
  static_intro_library_id: string | null;
  status: string
  user_id: string;
}

/* ----- Did numbers ----- */
export type DidNumber = {
  id: number;
  number: string;
  cnam: string | null;
  created_at: string;
  order_id: string;
  root_user_id: number;
  status: 'CONFIRMED' | 'ORDERED';
  toll_free: CeroOrOne;
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