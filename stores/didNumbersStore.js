import { defineStore } from "pinia"

export const useDidNumbersStore = defineStore("DidNumbersStore", {
  state: () => {
    return {
        did_numbers: [],
        toll_free_numbers: [],
        did_error: false,
        toll_free_error: false,
    }
  },
  actions: {
    async loadDidAndTollFreeNumbers() {
        this.did_numbers = [];
        this.toll_free_numbers = [];
        this.did_error = false;
        this.toll_free_error = false;

        const response = await fetchWrapper.get(GET_DID_AND_TOLL_FREE_NUMBERS_URL)    
        if(response.result) {
            response.did_numbers
                ? this.did_numbers = response.did_numbers
                : this.did_error = response.did_error
  
            response.toll_free_numbers
                ? this.toll_free_numbers = response.toll_free_numbers
                : this.toll_free_error = response.toll_free_error
        } else {
            this.did_error = response.did_error;
            this.toll_free_error = response.toll_free_error;
        }
    },
  },
})