<template>
    <section class="bg-white p-4 shadow-lg rounded-2xl w-[250px] min-h-[500px] flex flex-col justify-between">
        <div>
            <h5 class="font-semibold text-xl">Recap</h5>

            <ul class="font-semibold text-dark-3 mt-10">
                <li class="flex items-center justify-between">
                    {{ props.selectedType === 'credit' ? 'Credit Pack' : 'Unlimited Plan'}} <span class="text-grey-5">{{ format_price(recap_data.pack_info) }}</span>
                </li>
                <li class="mt-3 flex items-center justify-between">Discount <span class="text-grey-5">{{ format_price(recap_data.discount) }}</span></li>
                <li class="mt-3 flex items-center justify-between">Subtotal <span class="text-grey-5">{{ format_price(recap_data.subtotal) }}</span></li>
            </ul>

            <Divider class="bg-grey-6 h-[2px] rounded-full" />

            <div class="flex justify-between text-dark-3 font-semibold text-lg">
                <p>Total</p>
                <p>{{ format_price(recap_data.total) }}</p>
            </div>
        </div>

        <footer class="flex">
            <Button class="mt-6 w-full rounded-xl max-w-[170px] h-[42px] mx-auto" color="primary" :disabled="disabled_next">
                Next
            </Button>
        </footer>
        
    </section>
</template>
<script setup lang="ts">
    const props = defineProps<{
        selectedType: SelectedBillingType
    }>()

    const billingStore = useBillingStore()

    type RecapData = {
        pack_info: number
        discount: number
        subtotal: number
        total: number
    }

    const credit_recap_data = computed<RecapData>(() => {
        const step = billingStore.selected_step
        const pack_info = step ? Number(step.floor) * Number(step.regular_price) : 0
        const discount = step?.discount ? Number(pack_info) - Number(step.Total) : 0
        const subtotal = Number(pack_info) - Number(discount)
        const total = subtotal
        return { pack_info, discount, subtotal, total }
    })

    const plan_recap_data = computed<RecapData>(() => {
        const plan = billingStore.selected_plan
        const pack_info = plan ? Number(plan.price) : 0
        const discount = 0
        const subtotal = pack_info
        const total = subtotal
        return { pack_info, discount, subtotal, total }
    })

    const recap_data = computed<RecapData>(() => props.selectedType === 'credit' ? credit_recap_data.value : plan_recap_data.value)

    const disabled_next = computed(() => true)
</script>