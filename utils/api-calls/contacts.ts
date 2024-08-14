type ContactFilter = {
    page: number,
    limit: number,
    with_groups: boolean
    is_custom_group: boolean, 
    group_id:string,
    filter:string,
}

interface APIResponse {
    result: boolean,
    contacts: Contact[]
}

export async function getAllContacts(data:ContactFilter):Promise<Contact[] | null>{
    const response = await fetchWrapper.post(GET_ALL_CONTACTS_URL, data) as APIResponse
    if (!response.result) return null
    return response.contacts
}

