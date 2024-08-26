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
type upload_contact_validation_keys = 'from_broadcast' | 'group_id' | 'save_contact';

type UploadContactAPIResponse = {
    result: boolean;
    // contact?: uploadedContact; //TODO: Define uploadedContact
    validation_error? : Record<upload_contact_validation_keys, string>;
    db_error?: string;
}

export async function uploadContactCSV(data): Promise<UploadContactAPIResponse> {
    const response = await fetchWrapper.post(UPLOAD_CONTACT_CSV_URL, data) 
    return response as UploadContactAPIResponse
}