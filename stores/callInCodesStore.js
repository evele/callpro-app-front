import { defineStore } from "pinia"

export const useCallInCodesStore = defineStore("CallInCodesStore", {
  state: () => {
    return {
        user_call_in_codes: {}
    }
  },
  actions: {
    async loadUserCallInCodes() {
      const response = await fetchWrapper.get(LOAD_USER_CALL_IN_CODES_URL)    
      if(response.result) {
        this.user_call_in_codes = response.user_call_in_codes
      }
    },
  },
})