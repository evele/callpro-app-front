/* ----- System Groups ----- */
type SystemGroupsAPIResponse = {
    result: true,
    system_groups: SystemGroup[],
    total_monthly_numbers: number    
}

export async function getSystemGroups(): Promise<SystemGroupsAPIResponse | APIResponseError>{    
    return await fetchWrapper.get(GET_SYSTEM_GROUPS_URL) as SystemGroupsAPIResponse | APIResponseError
}

/* ----- Custom Groups ----- */
type CustomGroupsAPIResponse = {
    result: true,
    custom_groups: CustomGroup[],    
}

export async function getCustomGroups(): Promise<CustomGroupsAPIResponse | APIResponseError>{    
    return await fetchWrapper.get(GET_CUSTOM_GROUPS_URL) as CustomGroupsAPIResponse | APIResponseError
}