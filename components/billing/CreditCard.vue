<template>
    <CardOptionContainer type="credit">
        <template #chip-icon>
            <div class="min-w-20 w-fit h-[30px] rounded-lg bg-white border flex items-center gap-2 px-1 border-grey-main">
                <CoinSVG />
                <span class="text-dark-3 font-semibold leading-0 mt-[1px]">{{ formatted_step?.floor }}</span>
            </div>
        </template>
        
        <template #card-content>
            <div class="flex flex-col gap-1">
                <div class="flex justify-between items-center flex-wrap">
                    <p class="text-3xl font-semibold">{{ format_price(Number(formatted_step?.Total), 0) }}</p>
                    <div class="flex flex-col gap-1">
                        <div class="text-gray-200 text-xs font-normal flex items-center gap-1" :class="{ 'line-through': formatted_step?.discount }">
                            &cent; <p class="pt-[2px]">{{ formatted_step?.original_price }} x credit</p>
                        </div>
                        <div v-if="formatted_step?.discount" class="text-gray-200 text-xs font-normal flex items-center gap-1">
                            &cent; <p class="pt-[2px]">{{ formatted_step?.price_cents }} x credit</p>
                        </div>
                    </div>
                    
                </div>

                <Divider class="bg-[#E8DEF8] h-[2px] rounded-full" />

                <p v-show="formatted_step?.discount" class="text-xs text-light-purple-3 h-4 font-medium">{{ formatted_step?.discount_percent }}% discount</p>
            </div>
        </template>
        
    </CardOptionContainer>
</template>
<script setup lang="ts">

const props = defineProps<{
    step: PackageStep
}>()

type FormattedStep = PackageStep & {
    discount: boolean
    original_price: number
    discount_percent: number
}

const formatted_step = computed<FormattedStep | null>(() => {
    if(!props.step) return null

    const formatted_step = {
        ...props.step,
        discount: false,
        original_price: 100 * Number(parseFloat(props.step.regular_price).toFixed(0)),
        discount_percent: 0
    }

    if(props.step.price != props.step.regular_price) {
        formatted_step.discount = true
        formatted_step.original_price = 100 * Number(parseFloat(props.step.regular_price).toFixed(0))
        formatted_step.discount_percent = Math.round((1 - (Number(props.step.price) / Number(props.step.regular_price))) * 100);
    }

    return formatted_step
})
</script>