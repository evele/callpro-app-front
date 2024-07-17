<template>
    <div>
        <p v-if="isFetching">Loading data...</p>
        <div v-else>
            <div class="print-btn-container">
                <PrintPdfButton
                    elementId="print-invoice-pdf" 
                    :fileName="`invoice-${route.params.id}`" 
                    :pdfWidth="210"
                />
            </div>
            <section class="containter-main-content">
                <div class="main-content" id="print-invoice-pdf">
                    <h2 class="heading">The CallPro</h2>
                    <p>3 Teverya Way #301</p>
                    <p>Monroe NY 10950</p>
                    <p>(845) 378-1500</p>

                    <h1 class="heading">Invoice</h1>
                    <p>{{ general_data?.date.slice(0,10) }}</p>
                    <h3>Invoice for:</h3>
                    <p>Name: {{ general_data?.last_name + ' ' + general_data?.first_name }}</p>
                    <p>Ivr: {{ general_data?.account_no }}</p>
                    <p>Address: {{ general_data?.address }}</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router'
    import { useBillingStore } from "@/stores"

    const route = useRoute();
    const billingStore = useBillingStore()

    const general_data = computed(() => billingStore.invoice_data.invoice_data)
    const coupon_data = computed(() => billingStore.invoice_data.coupon_data)
    const isFetching = ref(false)

    onMounted(async() => {
        const invoice_id = route.params.id;
        isFetching.value = true
        await billingStore.loadInvoiceDataToPrint(invoice_id)
        isFetching.value = false
    })
</script>

<style scoped>
    .print-btn-container {
        display: flex;
        justify-content: center;
        margin: 1rem 0;
    }

    .containter-main-content {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .main-content {
        width: 100%;
        @media (min-width: 1100px) {
            width: 50%;
        }
        padding: 1rem 0 1rem 1rem;
    }

    .heading {
        color: #007bff;
    }
</style>