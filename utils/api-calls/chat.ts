/* ----- Chat contacts ----- */
type ChatContact = {
    contact_phone_number: string;
    name: string;
    time: StringOrNull;
    unread: ZeroOrOne;
}

type APIResponseChatContacts = {
    result: boolean;
    contacts?: ChatContact[];    
}

type fnProps = { all_contacts: OneOrTwo }

export async function getChatContacts(data: fnProps):Promise<APIResponseChatContacts | APIResponseError>{
    return await fetchWrapper.post(GET_CHAT_CONTACTS_URL, data) as APIResponseChatContacts | APIResponseError
}

/* ----- Unread messages ----- */
type APIResponseUnreadMessages = {
    result: boolean;
    unread_messages?: number;    
}

export async function getUnreadMessages():Promise<APIResponseUnreadMessages | APIResponseError>{
    return await fetchWrapper.get(GET_UNREAD_MESSAGES_URL) as APIResponseUnreadMessages | APIResponseError
}
