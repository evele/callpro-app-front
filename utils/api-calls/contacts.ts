/* ----- Get all contacts ----- */
type ContactFilter = {
    page: number,
    limit: number,
    with_groups: boolean
    is_custom_group: boolean, 
    group_id:string,
    filter:string,
}

type APIResponse = {
    result: boolean,
    contacts: ContactPhoneNumber[]
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

/* ----- Upload Contact ----- */
type upload_contact_validation_keys = 'from_broadcast' | 'group_id' | 'save_contact';

export type UploadContactAPIResponse = {
    result: boolean;
    contacts?: ContactUploadedData[];
    group_id?: string;
    validation_error? : Record<upload_contact_validation_keys, string>;
    db_error?: string;
}

export async function uploadContactCSV(data: FormData): Promise<UploadContactAPIResponse> {
    const response = await fetchWrapper.post(UPLOAD_CONTACT_CSV_URL, data) 
    return response as UploadContactAPIResponse
}

/* ----- Save Uploaded Contact ----- */
type save_uploaded_contact_validation_keys = `contact[${number}][number]` | 'group_id';

export type SaveUploadedContactAPIResponse = {
    result: boolean;
    validation_error? : Record<save_uploaded_contact_validation_keys, string>;
}

export async function saveUploadedContact(data: uploadedContactToSaveData): Promise<SaveUploadedContactAPIResponse> {
    const response = await fetchWrapper.post(SAVE_UPLOADED_CONTACT_URL, data) 
    return response as SaveUploadedContactAPIResponse
}