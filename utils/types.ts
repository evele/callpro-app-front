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

export type Tts_Convert = {
  full_file_url:string,
  file_name: string
}

// Type for Group Contacts
export type ContactGroup = {
  name: string;
  id: number | null;
  phone_launch_id: number | null;
};

// Interface for a audio
export interface Audio {
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

export interface AudioAux {
  id: string;
  audio_id: string | null;
  audio_url: string | null;
  name: string;
  created_at: string;
  last_used: string;
  file_name: string;
  length: string;
  is_delete: string;
  full_file_url: string;
}