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
            <Button class="mt-6 w-full rounded-xl max-w-[170px] h-[42px] mx-auto" color="primary" :disabled="disabled_next" @click="handle_go_next">
                Next
            </Button>
        </footer>
        
    </section>
</template>
<script setup lang="ts">
    const props = defineProps<{
        selectedType: SelectedBillingType
    }>()

    const emit = defineEmits<{
        (event: 'update:sectionToShow', value: BillingSectionToShow): void
    }>()

    const billingStore = useBillingStore()

    const recap_data = computed<RecapData>(() => billingStore.recap_data)

    const disabled_next = computed(() => {
        return billingStore.selected_step === null && billingStore.selected_plan === null && billingStore.reference_step_id === null
    })

    const handle_go_next = () => {
        emit('update:sectionToShow', 'checkout_form')
    }
</script>