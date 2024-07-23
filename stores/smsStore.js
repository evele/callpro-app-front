import { defineStore } from "pinia"

export const useSmsStore = defineStore("SmsStore", {
  state: () => {
    return {
        unread_messages: 0,
        chat_contacts: []
    }
  },
  actions: {
    async getUnreadMessages() {
      const response = await fetchWrapper.get(GET_UNREAD_MESSAGES_URL)    
      if(response.result) {
        this.unread_messages = response.unread_messages
      }
    },
    async getChatContacts(all_contacts) {
      const data = { all_contacts: all_contacts === true ? 1 : 2 }
      const response = await fetchWrapper.post(GET_CHAT_CONTACTS_URL, data)
      if(response.result) {
        this.chat_contacts = response.contacts
      }
    }
  },
})