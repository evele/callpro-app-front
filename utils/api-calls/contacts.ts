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
    result: true,
    contacts: ContactPhoneNumber[]
    total_numbers: number;
}


export async function getAllContacts(data:ContactFilter):Promise<APIResponse | APIResponseError>{
    return await fetchWrapper.post(GET_ALL_CONTACTS_URL, data) as APIResponse
}

/* ----- Get contact ----- */
type fnProps = { contact_id: string }

type GetContactAPIResponse = {
    result: true,
    contact_data: ContactPhoneNumber,    
}

export async function getContact(data: fnProps): Promise<GetContactAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(GET_CONTACT_URL, data) as GetContactAPIResponse | APIResponseError
}

/* ----- Get user custom groups ----- */
type UserCustomGroupsAPIResponse = {
    result: true,
    custom_groups: UserCustomGroup[],    
}

export async function getUserCustomGroups(): Promise<UserCustomGroupsAPIResponse | APIResponseError>{
    return await fetchWrapper.get(GET_USER_CUSTOM_GROUPS_URL) as UserCustomGroupsAPIResponse  | APIResponseError
}

/* ----- Save Contact ----- */
type SaveContactAPIResponse = {
    result: true,    
}

export async function saveContact(data: ContactToSaveData): Promise<SaveContactAPIResponse | APIResponseError>{    
    return await fetchWrapper.post(SAVE_CONTACT_URL, data)  as SaveContactAPIResponse | APIResponseError
}

/* ----- Upload Contact ----- */
export type UploadContactAPIResponse = {
    result: true,
    contacts: ContactUploadedData[],
    group_id: string,    
}

export async function uploadContactCSV(data: FormData): Promise<UploadContactAPIResponse | APIResponseError> {    
    return await fetchWrapper.post(UPLOAD_CONTACT_CSV_URL, data)  as UploadContactAPIResponse | APIResponseError
}

/* ----- Save Uploaded Contact ----- */
export type SaveUploadedContactAPIResponse = {
    result: true;    
}

export async function saveUploadedContact(data: uploadedContactToSaveData): Promise<SaveUploadedContactAPIResponse | APIResponseError> {
    return await fetchWrapper.post(SAVE_UPLOADED_CONTACT_URL, data)  as SaveUploadedContactAPIResponse | APIResponseError
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

/* ----- Get DNC Contacts ----- */
type DNCContactFilter = {
    page: number,
    limit: number,
    filter: string,
}

export type GetDNCContactsAPIResponse = {
    result: true;
    dnc_contacts: ContactDNC[];
    dnc_total_contacts: number; 
}

export async function getDNCContacts(data: DNCContactFilter): Promise<GetDNCContactsAPIResponse | APIResponseError> {
    return await fetchWrapper.post(GET_DNC_CONTACTS_FILTERED_URL, data) as GetDNCContactsAPIResponse | APIResponseError
}