<template>
    <div>
        <p class="text-title">Billing page</p>
        <button type="button" @click="load_data">Load Data</button>
        <ul>
            <li v-for="invoice in billingStore.user_invoices" :key="invoice.id" style="margin: 1rem 0;">
                {{ invoice.id }}
                <button type="button">
                    <NuxtLink :to="{ name: 'print_invoice-id', params: { id: invoice.id } }" target=”_blank”>View Invoice</NuxtLink>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { useBillingStore } from "@/stores"

    const billingStore = useBillingStore()

    onMounted(async() => {
        await billingStore.loadUserInvoicesData()
    })
    
    const load_data = () => {
        billingStore.loadUserInvoicesData()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>