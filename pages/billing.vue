<template>
    <div>
        <p class="text-title">Billing page</p>
        <button type="button" @click="load_data" style="display: block;">Load Data</button>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error?.message }}</span>
        <ul v-if="data?.invoices">
            <li v-for="invoice in data.invoices" :key="invoice.id" style="margin: 1rem 0;">
                {{ invoice.id }}
                <button type="button">
                    <NuxtLink :to="{ name: 'print_invoice-id', params: { id: invoice.id } }" target=”_blank”>View Invoice</NuxtLink>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    const { data, error, isLoading, isError, refetch } = useFetchInvoices()

    const load_data = () => {
        refetch()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>