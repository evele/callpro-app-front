<template>
    <CardOptionContainer type="credit" :is-selected="is_selected" @click="handle_select_step">
        <template #chip-icon>
            <div class="min-w-20 w-fit h-[30px] rounded-lg bg-white border-2 flex items-center gap-2 px-1 border-grey-main">
                <CoinSVG />
                <span class="text-dark-3 font-semibold leading-0 mt-[1px]">{{ formatted_step?.floor }}</span>
            </div>
        </template>
        
        <template #card-content>
            <div class="flex flex-col gap-1">
                <div class="flex justify-between items-center flex-wrap">
                    <p class="text-3xl font-semibold" :class="{ 'text-yellow-credits': is_selected }">{{ format_price(Number(formatted_step?.Total), 0) }}</p>
                    <div class="flex flex-col gap-1">
                        <div class="text-gray-200 text-xs font-normal flex items-center gap-1" :class="[ is_selected ? 'text-yellow-credits' : 'text-gray-200', formatted_step?.discount ? 'line-through' : '' ]">
                            &cent; <p class="pt-[2px]">{{ formatted_step?.original_price }} x credit</p>
                        </div>
                        <div v-if="formatted_step?.discount" class="text-xs font-normal flex items-center gap-1" :class="[ is_selected ? 'text-yellow-credits' : 'text-gray-200' ]">
                            &cent; <p class="pt-[2px]">{{ formatted_step?.price_cents }} x credit</p>
                        </div>
                    </div>
                    
                </div>

                <div class="bg-[#E8DEF8] h-[2px] my-4 rounded-full" />

                <p v-if="formatted_step?.discount" class="text-xs h-4 font-medium" :class="[ is_selected ? 'text-yellow-credits' : 'text-light-purple-3' ]">
                    {{ formatted_step?.discount_percent }}% discount
                </p>
                <div v-else class="h-4"></div>
            </div>
        </template>
        
    </CardOptionContainer>
</template>
<script setup lang="ts">

const props = defineProps<{
    step: PackageStepWithID
}>()

const billingStore = useBillingStore()

const is_selected = computed(() => billingStore.reference_step_id === props.step?.id || billingStore.selected_step?.id === props.step?.id)

const formatted_step = computed<FormattedStep>(() => {
    const formatted_step = {
        ...props.step,
        discount: false,
        original_price: Number((100 * parseFloat(props.step?.regular_price)).toFixed(0)),
        discount_percent: 0
    }

    if(props.step.price != props.step?.regular_price) {
        formatted_step.discount = true
        formatted_step.original_price = Number((100 * parseFloat(props.step?.regular_price)).toFixed(0))
        formatted_step.discount_percent = Math.round((1 - (Number(props.step?.price) / Number(props.step?.regular_price))) * 100);
    }

    return formatted_step
})

const handle_select_step = () => {
    billingStore.setReferenceStepId(null)
    billingStore.selectUnselectStep(formatted_step.value)
    const step = billingStore.selected_step

    if(step) {
        const pack_info = Number(step.floor) * Number(step.regular_price) || 0
        const discount = step.discount ? Number(pack_info) - Number(step.Total) : 0
        const subtotal = Number(pack_info) - Number(discount)
        const total = subtotal
        const recap_data = { pack_info, discount, subtotal, total }
        billingStore.setRecapData(recap_data)
    } else {
        billingStore.setRecapData(null)
    }
}
</script>