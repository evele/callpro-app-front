/* ----- System Groups ----- */
type SystemGroupsAPIResponse = {
    result: true,
    system_groups: SystemGroup,
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

/* ----- Move Number To Group ----- */
type MoveNumberToGroupAPIResponse = {
    result: true
}

export async function moveNumberToGroups(data: MoveNumberToGroup): Promise<MoveNumberToGroupAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(MOVE_NUMBER_TO_GROUP_URL, data) as MoveNumberToGroupAPIResponse | APIResponseError
}

/* ----- Add Number To Group ----- */
type AddNumberToGroupAPIResponse = {
    result: true  
}

export async function addNumberToGroups(data: AddNumberToGroup): Promise<AddNumberToGroupAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(ADD_NUMBER_TO_GROUP_URL, data) as AddNumberToGroupAPIResponse | APIResponseError
}