type ContactFilter = {
    page: number,
    limit: number,
    with_groups: boolean
    is_custom_group: boolean, 
    group_id:string,
    filter:string,
}

type validation_keys = 'page' | 'limit' | 'with_groups' | 'is_custom_group' | 'group_id' | 'dnc' | 'filter'

type APIResponse = {
    result: boolean,
    contacts: Contact[]
    validation_error?: Record<validation_keys,string>
}

export async function getAllContacts(data:ContactFilter):Promise<Contact[] | null>{
    const response = await fetchWrapper.post(GET_ALL_CONTACTS_URL, data) as APIResponse
    if (!response.result) return null
    return response.contacts
}

