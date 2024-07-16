import { defineStore } from "pinia"

export const useBillingStore = defineStore("BillingStore", {
  state: () => {
    return {
        user_invoices: [],
        invoice_data: {}
    }
  },
  actions: {
    async loadUserInvoicesData() {
      const response = await fetchWrapper.get(LOAD_USER_INVOICES_DATA_URL)    
      if(response.result) {
        this.user_invoices = response.invoices
      }
    },
    async loadInvoiceDataToPrint(invoice_id) {
      const data = { trx_id: invoice_id }
      const response = await fetchWrapper.post(LOAD_INVOICE_DATA_TO_PRINT_URL, data)
      if(response.result) {
        this.invoice_data = response.data
      }
    }
  },
})