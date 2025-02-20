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
export async function moveNumberToGroups(data: MoveNumberToGroup): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(MOVE_NUMBER_TO_GROUP_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Add Number To Group ----- */
export async function addNumberToGroups(data: AddNumberToGroup): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(ADD_NUMBER_TO_GROUP_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- Delete Group ----- */
export async function deleteUserGroup(data: GroupToDelete): Promise<APIResponseSuccess | APIResponseError>{    
    return await fetchWrapper.post(DELETE_USER_GROUP_URL, data) as APIResponseSuccess | APIResponseError
}