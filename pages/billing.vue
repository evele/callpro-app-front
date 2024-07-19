<template>
    <div>
        <p class="text-title">Billing page</p>
        <button type="button" @click="load_invoices">Load Invoices</button>
        <ul>
            <li v-for="invoice in billingStore.user_invoices" :key="invoice.id" style="margin: 1rem 0;">
                {{ invoice.id }}
                <button type="button">
                    <NuxtLink :to="{ name: 'print_invoice-id', params: { id: invoice.id } }" target=”_blank”>View Invoice</NuxtLink>
                </button>
            </li>
        </ul>

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
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>