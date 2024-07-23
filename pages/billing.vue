<template>
    <div>
        <p class="text-title">Billing page</p>
        <div class="first-section-container">
            <div>
                <button type="button" @click="load_invoices">Load Invoices</button>
                <ul>
                    <li v-for="invoice in billingStore.user_invoices" :key="invoice.id" style="margin: 1rem 0;">
                        {{ invoice.id }}
                        <button type="button">
                            <NuxtLink :to="{ name: 'print_invoice-id', params: { id: invoice.id } }" target=”_blank”>View Invoice</NuxtLink>
                        </button>
                    </li>
                </ul>
            </div>

            <div>
                <button type="button" @click="show_add_card_form">Add New Card</button>
                <p v-if="isSavingCard" style="color: blue;">Saving card...</p>
                <p v-if="showSuccess" style="color: green;">Success!</p>
                <p v-if="showError" style="color: red;">Error!</p>
                <div v-if="isAddingCard">
                    <form class="add-card-form">
                        <div>
                            <label for="number" style="margin-right: 10px;">Number</label>
                            <input v-model="cardNumber" id="number" type="text" placeholder="**** **** **** ****" class="form-input" />
                        </div>
                        
                        <div>
                            <label for="cc-name" style="margin-right: 10px;">Full Name</label>
                            <input v-model="cardName" id="cc-name" type="text" placeholder="JOHN DOE" class="form-input" />
                        </div>

                        <div>
                            <label for="expiry" style="margin-right: 10px;">MMYY</label>
                            <input v-model="cardMMYY" id="expiry" type="text" placeholder="0119" class="form-input" />
                        </div>

                        <div>
                            <label for="cvv" style="margin-right: 10px;">CVC</label>
                            <input v-model="cardCVC" id="cvv" type="text" placeholder="***" class="form-input" />
                        </div>
                        
                        <button type="button" @click="confirm_add_card">Save Card</button>
                    </form>
                </div>
            </div>
        </div>

        <button type="button" @click="load_cards">Load cards</button>
        <p v-if="isLoading">Loading data...</p>
        <ul v-else>
            <li v-for="card in userCreditCards" :key="card.id" style="margin: 10px 0;">
                {{ 'XXXX XXXX XXXX '+ card.last_four }}
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { useBillingStore, useCreditCardsStore } from "@/stores"

    const billingStore = useBillingStore()
    const creditCardsStore = useCreditCardsStore()

    const userCreditCards = computed(() => creditCardsStore.credit_cards)
    const isLoading = ref(true)
    const isAddingCard = ref(false)
    const isSavingCard = ref(false)
    const showSuccess = ref(false)
    const showError = ref(false)

    const cardNumber = ref('')
    const cardName = ref('')
    const cardMMYY = ref('')
    const cardCVC = ref('')

    onMounted(async() => {
        Promise.all([
            billingStore.getUserInvoicesData(),
            creditCardsStore.getUserCreditCards()
        ])
        isLoading.value = false
    })
    
    const load_invoices = () => {
        billingStore.getUserInvoicesData()
    }

    const load_cards = async () => {
        isLoading.value = true
        await creditCardsStore.getUserCreditCards()
        isLoading.value = false
    }

    const show_add_card_form = async () => {
        isAddingCard.value = true
    }

    const confirm_add_card = async () => {
        const dataToSend = {
            cc_number: cardNumber.value,
            cc_name: cardName.value,
            expiry: cardMMYY.value,
            cvv: cardCVC.value
        }
        console.log(dataToSend)

        isSavingCard.value = true
        const res = await creditCardsStore.addUserCreditCard(dataToSend)
        isSavingCard.value = false

        console.log(res)
        if(res.result) {
            isAddingCard.value = false
            showSuccess.value = true
            setTimeout(() => {
                showSuccess.value = false
            }, 3000)
            reset_form()
            load_cards()
        } else {
            showError.value = true
            setTimeout(() => {
                showError.value = false
            }, 3000)
            console.log(res)
        }
    }

    const reset_form = () => {
        cardNumber.value = ''
        cardName.value = ''
        cardMMYY.value = ''
        cardCVC.value = ''
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .first-section-container {
        display: flex;
        gap: 4rem;
    }
    .add-card-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
</style>