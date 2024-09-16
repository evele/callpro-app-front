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
    total_numbers: number;
}

export async function getAllContacts(data:ContactFilter):Promise<APIResponse>{
    const response = await fetchWrapper.post(GET_ALL_CONTACTS_URL, data) 
    return response as APIResponse
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

/* ----- Download Contacts ----- */
type data_string = {
    group_id: string
}

export async function downloadContactsFile(data: data_string): Promise<null> {
    try {
        const response = await fetchWrapper.post(DOWNLOAD_CONTACTS_FILE, data) ;
        const group_type = data.group_id;        
        const date_string = date_time_to_string();

        if (response instanceof  Blob) {
            const blob = response;
            const filename = `${group_type}-${'contacts'}-${date_string}${'.csv'}`;            

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            console.error('The response is not a Blob.');
        }        
    } catch (error) {
        console.error('Error processing the file download:', error);
    }
    return null;// TODO me tiraba error, busque y encontre esta solucion    
}