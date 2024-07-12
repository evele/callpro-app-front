import { defineStore } from "pinia"

export const useCallerIdStore = defineStore("CallerIdStore", {
  state: () => {
    return {
        caller_ids: {}
    }
  },
  actions: {
    async loadCallerIds() {
      const response = await fetchWrapper.get(LOAD_CALLER_IDS_URL)    
      if(response.result) {
        this.caller_ids = response.caller_ids
      }
    },
  },
})