import { defineStore } from "pinia"

export const useCreditCardsStore = defineStore("CreditCardsStore", {
  state: () => {
    return {
      credit_cards: []
    }
  },
  actions: {
    async getUserCreditCards() {
      const response = await fetchWrapper.get(GET_USER_CREDIT_CARDS_URL)    
      if(response.result) {
        this.credit_cards = response.cards
      }
    },
    async addUserCreditCard(card_data) {
      const response = await fetchWrapper.post(ADD_USER_CREDIT_CARD_URL, card_data)
      return response
    }
  },
})