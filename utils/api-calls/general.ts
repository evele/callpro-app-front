type GeneralAPIResponse = {
    result: true,    
    timezones: Timezone[],
    area_codes: AreaCodes[]
  }
  
export async function getUserGeneral():Promise<GeneralAPIResponse | APIResponseError> {    
    return await fetchWrapper.get(GET_AREA_CODES_AND_TIMEZONES_URL) as GeneralAPIResponse | APIResponseError;
}