/* ----- Audios Store ----- */
export const GET_AUDIOS_URL = "/audios/get_audios"
export const GET_AUDIO_URL = "/audios/get_audio"
export const CONVERT_TEXT_TO_SPEECH_URL = "/audios/tts_convertion"
export const SAVE_AUDIO_URL = "/audios/save_audio"
export const DELETE_AUDIO_URL = "/audios/delete_audio"
export const DOWNLOAD_AUDIO_URL = "/audios/download_audio_file"

/* ----- Auth Store ----- */
export const LOGIN_URL = "/jwtauth/login"
export const FORGOT_PASSWORD_URL ="/jwtauth/forgot_password"
export const RESET_PASSWORD_URL = "/jwtauth/reset_password"

/* ----- Billing Store ----- */
export const GET_USER_INVOICES_DATA_URL = "/billing/get_user_invoices_data"
export const GET_INVOICE_DATA_TO_PRINT_URL = "/billing/get_invoice_data_to_print"

/* ----- Broadcasts Store ----- */
export const GET_BROADCAST_HEADER_URL = "/broadcast/get_broadcast_header"
export const GET_BROADCAST_DETAIL_URL = "/broadcast/get_broadcast_detail"

/* ----- Caller ID Store ----- */
export const GET_CALLER_IDS_URL = "/caller_id/get_caller_ids"

/* ----- Call In Codes Store ----- */
export const GET_USER_CALL_IN_CODES_URL = "/call_in_codes/get_user_call_in_codes"
export const CREATE_CALL_IN_CODE_URL = "/call_in_codes/create_user_call_in_code"
export const DELETE_CALL_IN_CODE_URL = "/call_in_codes/delete_user_call_in_code"

/* ----- Contacts Store ----- */
export const GET_CONTACT_URL = "/contacts/get_contact"
export const GET_ALL_CONTACTS_URL = "/contacts/get_all_contacts"
export const SAVE_CONTACT_URL = "/contacts/save_contact"
export const GET_USER_CUSTOM_GROUPS_URL = "/contacts/get_user_custom_groups"
export const UPLOAD_CONTACT_CSV_URL = "/contacts/upload_contact_csv"
export const UPLOAD_DNC_CONTACT_CSV_URL = "/contacts/upload_dnc_csv"
export const SAVE_UPLOADED_CONTACT_URL = "/contacts/save_uploaded_contact"
export const DOWNLOAD_CONTACTS_FILE = "/contacts/download_contacts_as_csv"
export const DOWNLOAD_DNC_CONTACTS_FILE = "/contacts/download_dnc_as_csv"
export const GET_DNC_CONTACTS_FILTERED_URL = "/contacts/get_dnc_contacts_filtered"
export const ADD_DNC_CONTACT_URL = "/contacts/insert_dnc"
export const SEND_CONTACT_TO_TRASH_URL = "/contacts/delete_numbers_contacts"
export const SEND_NUMBER_TO_TRASH_URL = "/contacts/delete_numbers_contacts"  // TODO: check if should be the same
export const REMOVE_NUMBER_FROM_DNC_URL = "/contacts/remove_number_from_dnc"

/* ----- Dashboard Store ----- */
export const GET_BROADCAST_LIST_URL = "/broadcast/get_broadcast_list"

/* ----- Did Numbers Store ----- */
export const GET_DID_AND_TOLL_FREE_NUMBERS_URL = "/did_numbers/get_user_did_and_toll_free_numbers"

/* ----- Groups Store ----- */
export const GET_SYSTEM_GROUPS_URL = "/contacts/get_system_groups"
export const GET_CUSTOM_GROUPS_URL = "/contacts/get_custom_groups"
export const SAVE_GROUP_CONTACTS_URL = "/contacts/create_edit_groups_contacts"
export const MOVE_NUMBER_TO_GROUP_URL = "/contacts/move_number_to_group"
export const ADD_NUMBER_TO_GROUP_URL = "/contacts/add_number_to_group"
/* ---- General Store ----*/
export const GET_AREA_CODES_AND_TIMEZONES_URL = "/general/get_area_codes_and_timezones"

/* ----- Packages Store ----- */
export const GET_PACKAGE_STEPS_URL = "/packages/get_package_steps_prices"
export const GET_MONTHLY_GROUPS_PLANS_URL = "/packages/get_package_monthly_groups_plans"

/* ----- Settings Store ----- */
export const GET_SETTINGS_DATA_URL = "/settings/get_settings_data"
export const UPDATE_VOICE_SETTINGS_URL = "/settings/save_audio_settings"
export const UPDATE_TEXT_SETTINGS_URL = "/settings/save_text_settings"
export const UPDATE_GENERAL_SETTINGS_URL = "/settings/save_general_settings"

/* ----- SMS Store ----- */
export const GET_UNREAD_MESSAGES_URL = "/sms/get_unread_messages"
export const GET_CHAT_CONTACTS_URL = "/sms/get_chat_contacts"
export const GET_SMS_DATA_URL = "/sms/get_sms_list"

