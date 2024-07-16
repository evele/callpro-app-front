<template>
    <div>
        <p class="text-title">Billing page</p>
        <button type="button" @click="load_data">Load Data</button>
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