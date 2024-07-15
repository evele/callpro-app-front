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
    async createUserCallInCode(data) {
      const response = await fetchWrapper.post(CREATE_CALL_IN_CODE_URL, data)    
      if(response.result) {
        this.loadUserCallInCodes()
      }
    },
    async deleteUserCallInCode(id) {
      const response = await fetchWrapper.post(DELETE_CALL_IN_CODE_URL, id)    
      if(response.result) {
        this.loadUserCallInCodes()
      }
    },
  }
})