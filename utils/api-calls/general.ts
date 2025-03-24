type GeneralAPIResponse = {
  result: true,    
  timezones: Timezone[],
  area_codes: AreaCodes[]
}
  
export async function getUserGeneral():Promise<GeneralAPIResponse | APIResponseError> {    
  return await fetchWrapper.get(GET_AREA_CODES_AND_TIMEZONES_URL) as GeneralAPIResponse | APIResponseError;
}

type UserTimezoneAPIResponse = APIResponseSuccess & {
  user_timezone: Timezone;
}

export async function getUserTimezone():Promise<UserTimezoneAPIResponse | APIResponseError> {    
  return await fetchWrapper.get(GET_USER_TIMEZONE_URL) as UserTimezoneAPIResponse | APIResponseError;
}