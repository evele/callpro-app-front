export type ItemsPerPage = 10 | 25 | 50 | 100;
export type ItemsPerPageOption = { name: string; code: ItemsPerPage };
export type DashboardState = typeof COMPLETED | typeof ACTIVE | typeof DRAFT;
export type ZeroOrOne = '0' | '1';
export type OneOrTwo = '1' | '2';
export type OneToFour = '1' | '2' | '3' | '4';
export type OneToNine = OneToFour | '5' | '6' | '7' | '8' | '9';
export type CallSpeed = '5' | '20' | '50' | '100' | '200' | '999';
export type SelectOption = { name: string; code: string };
export type StringOrNumber = string | number;
export type StringOrNull = string | null;
export type NumberOrNull = number | null;
export type BooleanOrNull = boolean | null;
export type StringOrNumberOrNull = string | number | null;
export type StateOption = 'ALL' | 'LIVE'| 'VM'| 'INVALID'| 'NA';
export type ContactsModalSectionToShow = '' | 'contact' | 'new_group' | 'dnc' | 'upload';
export type AudioLbryModalSectionToShow = '' | 'tts' | 'call_in' | 'upload';
export type FilterOption = { id: string, name: string, count: number }

export type APIResponseError = {
  result: false,
  error?:string,
  validation_error?: Record<string, string>
}

export type APIResponseSuccess = {
  result: true
}

export type User = {
  id: string;
  token: string;
};

export type LoginResponseSuccess = {
  result: true;
  user: User; 
  message: string;
};


export type validateConfirmationCode = {
  confirmation_code: number;
  root_id: string;
}

export type UserRegister = {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  timezone: OneToNine;
  agreeToTerms: '0' | '1';
  notRobot: '0' | '1';
  ivr_bind: boolean;
  root_id: string | null;
}

export type SaveContactAPIResponse = APIResponseSuccess & {
  already_exists?: string[]
}

export type CallerIDFetchAPIRsponse = APIResponseSuccess & {
  caller_ids: CallerID[]
}

export type ContactSelectedGroup = { 
  group_name: string, 
  group_id: string, 
  group_code: string,
  is_custom: boolean 
}

export type AllContactsQueryParams = {
  page: number,
  show: number,
  with_groups: boolean,
  is_custom_group: boolean,
  group_id: string[],
  filter: string,
}

export type NumberIdObject = { number_id: string }
export type NumberIdArray = { number_ids: string[] }

// Interface for a phone number and its associated groups
export type PhoneNumber = {
  number_id: string; // Unique identifier for the number
  number: string; // The phone number itself
  notes: string; // Notes associated with the number
  dnc: ZeroOrOne; // Do Not Call status
  type: OneToFour; // Type of the number
  number_groups: string[] | string; // Array of group identifiers the number belongs to
  in_trash: ZeroOrOne; // Indicates if the number is in trash
}
  
// Interface for a contact
export type Contact = {
  id: string; // Unique identifier for the contact
  first_name: string; // First name of the contact
  last_name: string; // Last name of the contact
  numbers: PhoneNumber[]; // Array of phone numbers associated with the contact
}

export type ContactToEdit = {
  id: string;
  first_name: string;
  last_name: string;
  numbers: ContactNumberWithReceivedGroups[]
}

export type ContactPhoneNumber = PhoneNumber & {
  id: number;
  first_name: string;
  last_name: string;
  is_deleted: ZeroOrOne;
}

export type ContactDNC = {
  dnc: '1' | '2';
  first_name: StringOrNull;
  last_name: StringOrNull;
  number: string;
  number_id: StringOrNull;
}

// Type for Group Contacts
export type ContactGroup = {
  name: string;
  id: NumberOrNull;
  phone_launch_id: StringOrNumber;
};

export type ReceivedNumberGroups = { number_groups: StringOrNull }

export type ContactNumberWithoutGroups = {
  id: string,
  number: string,
  notes: string,
  type: '' | OneToFour,
}

export type ContactNumberWithReceivedGroups = ContactNumberWithoutGroups & ReceivedNumberGroups;

export type ContactNumber = ContactNumberWithoutGroups & {
  number_groups: string[]
}

export type ContactToSave = {
  contact_id: StringOrNull,
  first_name: string,
  last_name: string,
  numbers: ContactNumber[]
}

export type ContactBeforeToSave = {
  contact_id: StringOrNull,
  first_name: string,
  last_name: string,
  numbers: ContactNumber
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
    number_id: number;
    in_trash: 0;
    dnc: 0;
  }[];
}

export type uploadedContactToSave = {
  first_name: string;
  last_name: string;
  number: number;
  contact_id: number;
  number_id: number;
};

export type uploadedContactToSaveData = {
  contacts: uploadedContactToSave[];
  group_id: string;
}

export type UserCustomGroup = {
  audio_name: StringOrNull,
  group_code: number | '',
  group_name: string,
  id: number,
  root_user_id: number,
}

/* ----- START CALLER ID TYPES ----- */
export type CallerID = {
  id: string;
  caller_id: string;
  status: CallerIDStatus;
  user_id: string;
}

export type CallerIDExt = CallerID & { ext: string; }

export enum CallerIDStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  UNVERIFIED = 'UNVERIFIED',
  REJECTED = 'REJECTED'
}

export type CallerIDToVerify = {
  caller_id: string;
  status: CallerIDStatus.REJECTED;
}

export type CallerIDToDelete = {
  caller_id: string;
}
/* ----- END CALLER ID TYPES ----- */

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
  static_intro_library_id: StringOrNull;
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
  id: string;
  group_code: StringOrNumberOrNull;
  group_name: string;
  count: number;
}

export type AddNumberToGroup = {
  number_id: NumberIdObject[];
  groups: string[];
}

export type MoveNumberToGroup = AddNumberToGroup & {
  current_group_id: string;
}

export type RemoveNumberFromGroup = NumberIdArray & {
  group_id: string;
}

export type SendNumberToTrash = {
  number_ids: string[]; 
}

export type GroupToDelete = {
  group_id: string;
  numbers_to_trash: boolean;
  rest_of_user_groups: string[];
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
  ivr_input: NumberOrNull;
  name: StringOrNumber;
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

export type AreaCodes = {
  id: number;
  area_code: number;
  area_description: string;
  available: ZeroOrOne;
}

export type GeneralSettings = {
  call_window_end: string;
  call_window_start: string;
  time_guard: ZeroOrOne;
  time_zone: OneToNine;
}

export type VoiceSettings = {
  caller_id: string;
  static_intro: ZeroOrOne;
  static_intro_library_id: NumberOrNull;
  repeat: ZeroOrOne;
  repeat_audio: 'system' | 'library' | 'broadcast' | null;
  repeat_library_id: NumberOrNull;
  offer_dnc: ZeroOrOne;
  retries: OneToFour;
  call_speed: CallSpeed;
  amd_detection: ZeroOrOne,
  email_on_finish: ZeroOrOne;
  number_when_completed: string;
  number_when_completed_status: ZeroOrOne;
}

export type VoiceSettingsWithAudio = VoiceSettings & { static_intro_audio_selected: Audio | null }

export type Settings = GeneralSettings & VoiceSettings;

export type TextSettings = {
  chat: ZeroOrOne;
  root_user_id?: number;
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
  special_monthly_credits_id: NumberOrNull;
  special_monthly_groups_id: NumberOrNull;
  special_paug_id: number;
  voice_price: number;
}

export type VoiceSettingsUI = {
  caller_id_selected: undefined | OneOrTwo | '3',
  caller_id: string,
  call_pro_number: string,
  toll_free_number: string,
  static_intro: boolean,
  static_intro_library_id: undefined | NumberOrNull
  static_intro_audio_selected: undefined | Audio | null
  repeat: boolean,
  offer_dnc: boolean,
  retries: undefined | OneToFour,
  call_speed: undefined | CallSpeed,
  amd_detection: boolean,
  email_on_finish: boolean,
  number_when_completed_status: boolean,
  number_when_completed: string,
}

export type TextSettingsUI = {
  text_caller_id_selected: undefined | OneOrTwo,
  text_caller_id: string,
  call_pro_number: string,
  toll_free_number: string,
  chat: boolean,
  sms_dnc: boolean
}

export type GeneralSettingsUI = {
  call_window_start: Date | null,
  call_window_end: Date | null,
  time_guard: boolean,
  time_zone: undefined | OneToNine 
}

export type VoiceSettingsDataToSave = {
  settings: VoiceSettings;
  cid_confirm: ZeroOrOne;
}

export type TextSettingsDataToSave = {
  settings: {
    text_caller_id: string;
    chat: ZeroOrOne;
    sms_dnc: ZeroOrOne;
  }
}

export type GeneralSettingsDataToSave = {
  settings: GeneralSettings;
}

/* ----- Audio ----- */
export type Tts_Convert = {
  full_file_url:string,
  file_name: string
}

export type Tts_Convert_with_name = Tts_Convert & { name: string }

// TODO: Ver Audio y AudioAUX para extender o algo similar
export type Audio = {
  id: number;
  user_id: number | string;
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

export type ProcessedAudio = Audio & {
  position: number;
  created_at: string;
  last_used: string;
};

export type AudioInfoToSave = {
  audio_id?: number;
  file_name: string;
  length?: number;
  name: string;
}

export type AudioToSave = {
  action: 'create' | 'update',
  audio_info: AudioInfoToSave[]
}

export type AudioToDelete = {
  audio_id: number;
}

export type CreateCallInCodeResponse = APIResponseSuccess & {
  call_in_code: number;
}

export type uploadAudioResponse = APIResponseSuccess & {
  data: {
    full_file_url: string;
    upload_data: {
      client_name: string;
      file_ext: string;
      file_name: string;
      file_path: string;
      file_size: number;
      file_type: string;
      full_path: string;
      image_height: number | null;
      image_size_str: string;
      image_type: string;
      image_width: number | null;
      is_image: boolean;
      orig_name: string;
      raw_name: string;
    }
  }
}

export type FetchedAudio = {
  data: {
    audio_full_url: string,
    audio_id: number,
    get: Audio[],
    name: string
  }
}

export type APIResponseUserAudio = APIResponseSuccess & FetchedAudio

/* ----- Billing ----- */
export enum TransactionType {
  BROADCAST = 'BROADCAST',
  SMS = 'SMS',
  PAYMENT = 'PAYMENT',
  CHARGE = 'CHARGE',
  CHAT = 'CHAT'
}

export type Transaction = {
  id: string;
  amount: string;
  b_name: StringOrNull;
  description: StringOrNull;
  parent_id: StringOrNull;
  s_name: StringOrNull;
  soft_delete: StringOrNull;
  soft_deleted: StringOrNull;
  time_stamp: string;
  type: TransactionType;
  user_id: string;
}

type PaymentMethodDetails = {
  card_number: string;
  card_holder: string;
}

type PaymentMethodData = {
payment_method: string;
payment_method_details: PaymentMethodDetails;
}

type SuccessResult = {
xResult: string;
xStatus: string;
xError: string;
xErrorCode: string;
xRefNum: string;
xExp: string;
xDate: string;
xAuthCode: string;
xBatch: string;
xAvsResultCode: string;
xAvsResult: string;
xCvvResultCode: string;
xCvvResult: string;
xAuthAmount: string;
xToken: string;
xMaskedCardNumber: string;
xCardType: string;
query_data: {
  xKey: string;
  xVersion: string;
  xSoftwareName: string;
  xSoftwareVersion: string;
  xCommand: string;
  xToken: string;
  xAmount: number;
};
}

type CardResponse = {
success_result: SuccessResult;
}

type ResponseData ={
success: boolean;
card_response: CardResponse;
}

type CouponDb = {
id: number;
code: string;
discount_type: string;
discount_value: number;
public: ZeroOrOne;
all_plans: ZeroOrOne;
times: string;
expiry_date: string;
}

export type CouponDetails = {
couponCode: string;
discountDisplay: string;
discountAmount: number;
finalPrice: number;
coupon_id: number;
couponDb: CouponDb;
}

export type Invoice = {
id: string;
confirmation_number: number;
user_id: number;
package_type: StringOrNull;
payment_method_data: PaymentMethodData;
total: number;
response_data: ResponseData | string; // Puede ser un string serializado o un objeto
status: ZeroOrOne;
coupon_details: CouponDetails | string; // Puede ser un string serializado o un objeto
invoice_data: string;
time_stamp: string;
}

export type SelectedBillingType = 'credit' | 'plan';

export enum PackageType {
  CREDITS_PLAN = 'CREDITS',
  GROUPS_PLAN = 'GROUPS',
  PAUG_PLAN = 'PAUG',
  FREE_PLAN = 'FREE'
}

export enum ExpiryState {
  OK = 'EXPIRY_STATE_OK',
  NEAR_TO_EXPIRE = 'EXPIRY_STATE_NEAR_TO_EXPIRE',
  EXPIRED = 'EXPIRY_STATE_EXPIRED',
}

export enum CardType {
  VISA = 'Visa',
  MASTERCARD = 'Mastercard',
  AMERICAN_EXPRESS = 'American Express',
  DISCOVER = 'Discover',
  JCB = 'JCB',
  DINERS_CLUB = 'Diners Club',
  UNKNOWN = 'Unknown'
}

export type UserCurrentPlanData = {
  active: ZeroOrOne | null;
  auto_renew: ZeroOrOne | null;
  credits: NumberOrNull;
  current_package_id: NumberOrNull;
  current_package_type: PackageType;
  end_date: StringOrNull;
  start_date: StringOrNull;
  time_stamp: StringOrNull;
  id: NumberOrNull
  numbers: NumberOrNull;
  payment_history_id: NumberOrNull;
  pending_downgrade_package_id: NumberOrNull;
  price: NumberOrNull;
  root_user_id: number;
}

export type CC_CARD = {
  cc_name: string;
  cvv: string;
  expiry: string;
  expiry_state: ExpiryState;
  card_type: CardType;
  last_four: string;
  id: number;
  is_default: ZeroOrOne;
  number: string;
  status: ZeroOrOne;
  time_stamp: string;
  user_id: number;
}
