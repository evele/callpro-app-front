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


/* ----- Upload Contact ----- */
type save_contact_validation_fields = 'id' | 'number' | 'type' | 'notes';

type save_contact_validation_keys = 
    'action' | 
    'save_contact' |
    `contact_info[numbers][${number}][${save_contact_validation_fields}]` |
    `contact_info[numbers][${number}][number_groups][${number}]`;

type UploadContactAPIResponse = {
    result: boolean;
    validation_error? : Record<save_contact_validation_keys, string>
    db_error?: string
}

export async function uploadContactCSV(data: FormData): Promise<UploadContactAPIResponse>{
    console.log('llega')
    const response = await fetchWrapper.post(UPLOAD_CONTACT_CSV_URL, data) 
    return response as UploadContactAPIResponse
}