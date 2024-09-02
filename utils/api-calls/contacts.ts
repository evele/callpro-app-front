/* ----- Get all contacts ----- */
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
    contacts: ContactPhoneNumber[]
    validation_error?: Record<validation_keys,string>
}

export async function getAllContacts(data:ContactFilter):Promise<ContactPhoneNumber[] | null>{
    const response = await fetchWrapper.post(GET_ALL_CONTACTS_URL, data) as APIResponse
    if (!response.result) return null
    return response.contacts
}

/* ----- Get contact ----- */
type fnProps = { contact_id: string }

type get_contact_validation_keys = 'contact_id';

type GetContactAPIResponse = {
    result: boolean,
    contact_data?: ContactPhoneNumber,
    validation_error?: Record<get_contact_validation_keys, string>,
    db_error?: string
}

export async function getContact(data: fnProps): Promise<GetContactAPIResponse>{
    const response = await fetchWrapper.post(GET_CONTACT_URL, data) 
    return response as GetContactAPIResponse
}

/* ----- Get user custom groups ----- */
type UserCustomGroupsAPIResponse = {
    result: boolean,
    custom_groups?: UserCustomGroup[],
    db_error?: string
}

export async function getUserCustomGroups(): Promise<UserCustomGroupsAPIResponse>{
    const response = await fetchWrapper.get(GET_USER_CUSTOM_GROUPS_URL) 
    return response as UserCustomGroupsAPIResponse
}

/* ----- Save Contact ----- */
type save_contact_validation_fields = 'id' | 'number' | 'type' | 'notes';

type save_contact_validation_keys = 
    'action' | 
    'save_contact' |
    `contact_info[numbers][${number}][${save_contact_validation_fields}]` |
    `contact_info[numbers][${number}][number_groups][${number}]`;

type SaveContactAPIResponse = {
    result: boolean;
    validation_error? : Record<save_contact_validation_keys, string>
    db_error?: string
}

export async function saveContact(data: ContactToSaveData): Promise<SaveContactAPIResponse>{
    const response = await fetchWrapper.post(SAVE_CONTACT_URL, data) 
    return response as SaveContactAPIResponse
}