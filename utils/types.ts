// Interface for a phone number and its associated groups
export interface PhoneNumber {
  number_id: string; // Unique identifier for the number
  number: string; // The phone number itself
  notes: string; // Notes associated with the number
  dnc: boolean; // Do Not Call status
  type: string; // Type of the number
  number_groups: string[]; // Array of group identifiers the number belongs to
  in_trash: boolean; // Indicates if the number is in trash
}
  
// Interface for a contact
export interface Contact {
  id: string; // Unique identifier for the contact
  first_name: string; // First name of the contact
  last_name: string; // Last name of the contact
  numbers: PhoneNumber[]; // Array of phone numbers associated with the contact
}

// Type for Group Contacts
export type ContactGroup = {
  name: string;
  id: number | null;
  phone_launch_id: number | null;
};

export type CallerID = {
  id: string;
  caller_id: string;
  status: 'PENDING' | 'CONFIRMED' | 'UNVERIFIED' | 'REJECTED';
  user_id: string;
}

export interface BroadcastDashboardData {
  ACTIVE: string;
  INVALID: string;
  LIVE: string;
  NA: string;
  PENDING: string;
  TRANSFERRED: string;
  VM: string;
  amd_detection: '0' | '1';
  audio_name: string;
  broadcast_id: string;
  call_speed: string;
  caller_id: string;
  created_at: string;
  duration: string;
  email_on_finish: '0' | '1';
  ended_at: string;
  feedback: '0' | '1';
  file_name: string;
  library_id: string;
  name: string;
  number_when_completed: string;
  offer_dnc: '0' | '1';
  repeat: '0' | '1';
  retries: '1' | '2' | '3' | '4';
  start_time: string;
  started_at: string;
  static_intro_library_id: string | null;
  status: string
  user_id: string;
}