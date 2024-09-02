/* ----- System Groups ----- */
type SystemGroupsAPIResponse = {
    result: boolean,
    system_groups?: SystemGroup[],
    total_monthly_numbers?: number
    db_error?: string,
}

export async function getSystemGroups(): Promise<SystemGroupsAPIResponse>{
    const response = await fetchWrapper.get(GET_SYSTEM_GROUPS_URL) 
    return response as SystemGroupsAPIResponse
}

/* ----- Custom Groups ----- */
type CustomGroupsAPIResponse = {
    result: boolean,
    custom_groups?: CustomGroup[],
    db_error?: string,
}

export async function getCustomGroups(): Promise<CustomGroupsAPIResponse>{
    const response = await fetchWrapper.get(GET_CUSTOM_GROUPS_URL) 
    return response as CustomGroupsAPIResponse
}