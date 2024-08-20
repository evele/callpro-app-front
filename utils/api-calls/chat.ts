/* ----- Chat contacts ----- */
type ChatContact = {
    contact_phone_number: string;
    name: string;
    time: string | null;
    unread: '0' | '1';
}

type validation_keys = 'all_contacts'

type APIResponseChatContacts = {
    result: boolean;
    contacts?: ChatContact[];
    db_error?: string;
    validation_error?: Record<validation_keys, string>;
}

type fnProps = { all_contacts: '1' | '2' }

export async function getChatContacts(data: fnProps):Promise<APIResponseChatContacts>{
    const response = await fetchWrapper.post(GET_CHAT_CONTACTS_URL, data)
    return response as APIResponseChatContacts
}

/* ----- Unread messages ----- */
type APIResponseUnreadMessages = {
    result: boolean;
    unread_messages?: number;
    db_error?: string;
}

export async function getUnreadMessages():Promise<APIResponseUnreadMessages>{
    const response = await fetchWrapper.get(GET_UNREAD_MESSAGES_URL)
    return response as APIResponseUnreadMessages
}
