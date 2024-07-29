<template>
    <div>
        <span v-if="isPending">Loading...</span>
        <span v-else-if="isError">Error: {{ error.message }}</span>
        <div v-if="isSuccess">
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
                    <p>{{ data?.invoice_data?.date.slice(0,10) }}</p>
                    <h3>Invoice for:</h3>
                    <p>Name: {{ data?.invoice_data?.last_name + ' ' + data?.invoice_data?.first_name }}</p>
                    <p>Ivr: {{ data?.invoice_data?.account_no }}</p>
                    <p>Address: {{ data?.invoice_data?.address }}</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router'

    const route = useRoute();
    const { mutate: getInvoiceData, data, isPending, isSuccess, isError, error } = useFetchInvoiceToPrint();

    onMounted(() => {
        const invoice_id = route.params.id;
        const id = { trx_id: invoice_id }
        getInvoiceData(id)
    });

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