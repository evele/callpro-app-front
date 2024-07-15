/* ----- Auth Store ----- */
export const LOGIN_URL = "/jwtauth/login"
export const RECOVERY_MAIL_URL = "/jwtauth/send_recovery_mail"
export const RESET_PASSWORD_URL = "/jwtauth/reset_password"

/* ----- Caller ID Store ----- */
export const LOAD_CALLER_IDS_URL = "/caller_id/get_caller_ids"

/* ----- Settings Store ----- */
export const LOAD_SETTINGS_DATA_URL = "/settings/get_settings_data"

/* ----- Call In Codes Store ----- */
export const LOAD_USER_CALL_IN_CODES_URL = "/call_in_codes/get_user_call_in_codes"
export const CREATE_CALL_IN_CODE_URL = "/call_in_codes/create_user_call_in_code"
export const DELETE_CALL_IN_CODE_URL = "/call_in_codes/delete_user_call_in_code"