import { defineStore } from "pinia"

export const useBillingStore = defineStore("BillingStore", {
  state: () => {
    return {
        user_invoices: []
    }
  },
  actions: {
    async loadUserInvoicesData() {
      const response = await fetchWrapper.get(LOAD_USER_INVOICES_DATA_URL)    
      if(response.result) {
        this.user_invoices = response.invoices
      }
    },
  },
})