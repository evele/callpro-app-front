<template>
    <section 
        :id="`invoice-${props.invoice.invoice_id}`"
        class="flex flex-col gap-4 p-3" 
    >
        <div>
            <h4 class="text-3xl text-indigo-600">The CallPro</h4>
            <p>3 Teverya Way #301</p>
            <p>Monroe NY 10950</p>
            <p>(845) 378-1500</p>
        </div>

        <h3 class="font-bold text-6xl text-indigo-700">Invoice</h3>
        <div class="flex flex-col">
            <div class="flex justify-between">
                <div class="flex flex-col gap-2">
                    <p class="text-indigo-700 font-bold">{{ format_date(invoice_data?.date) }}</p>
                    <p class="font-bold text-xl">Invoice for</p>
                    <p>Name: {{ invoice_data?.last_name + ' ' + invoice_data?.first_name }}</p>
                    <p>Ivr: {{ invoice_data?.account_no }}</p>
                    <p>Address: {{ invoice_data?.address }}</p>
                </div>

                <div class="flex flex-col gap-2 mt-6">
                    <p class="font-bold">Invoice #</p>
                    <p>{{ invoice_data?.number }}</p>
                </div>
            </div>

            <div class="h-[2px] rounded-full w-full bg-gray-500 mt-2 mb-4" />

            <div class="flex">
                <div class="flex-grow">
                    <p class="font-bold text-xl text-indigo-600 mb-2">Description</p>
                    <p class="bg-gray-200 pl-1">{{ invoice_data?.item_desc ?? '-' }}</p>
                </div>

                <div>
                    <p class="font-bold text-xl text-indigo-600 mb-2">Amount</p>
                    <p class="bg-gray-200">$ {{ invoice_amount }}</p>
                </div>
            </div>

            <div class="h-[2px] rounded-full w-full bg-gray-500 mt-6 mb-4" />

            <div class="flex flex-col w-full">
                <div class="self-end flex items-center">
                    <span class="text-right">Total</span> <p class="font-semibold ml-2 min-w-[70px] text-left">$ {{ invoice_amount.toFixed(2) }}</p>
                </div>
                <div v-if="Number(props.invoice.invoice_coupon[0]?.coupon_amount) > 0" class="self-end flex items-center" @click="console.log(props.invoice.invoice_coupon[0]?.coupon_amount)">
                    <span class="text-right flex-grow">Coupon</span> <p class="text-danger-1 font-semibold ml-2 min-w-[70px] text-left">($ {{ invoice_amount }})</p>
                </div>
                <div class="self-end flex items-center"><span class="text-right flex-grow">
                    Payed with cc {{ invoice_data?.cc_last_four }} </span><p class="ml-2 min-w-[70px] text-left">$ {{ total_payed_with_cc.toFixed(2) }}</p>
                </div>
                <div class="self-end flex items-center"><span class="text-right flex-grow">
                    Total due </span><p class="ml-2 min-w-[70px] text-left">$ 0.00</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    const props = defineProps<{
        invoice: InvoicesInfo,
    }>()

    const invoice_data = ref(props.invoice.invoice_data)

    const invoice_amount = computed(() => {
        return (Number(props.invoice.invoice_data?.amount) + Number(props.invoice.invoice_coupon[0]?.coupon_amount)) * props.invoice.invoice_data?.quantity
    })

    const total_payed_with_cc = computed(() => invoice_amount.value - Number(props.invoice.invoice_coupon[0]?.coupon_amount))

    // return example: Mar 04 2025
    const format_date = (date: string) => {
        if(!date) return ''
        return new Date(date).toDateString().slice(4, 15)
    }
</script>