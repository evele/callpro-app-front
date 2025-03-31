<template>
    <div 
        class="w-full bg-white min-h-[122px] rounded-md border p-4 flex items-center justify-between hover:cursor-pointer hover:border-solid"
        :class="border_style"
    >
        <div class="flex items-center gap-8">
            <div>
                <div v-if="card_type === CardType.UNKNOWN" class="w-[75px]"></div>
                <component v-else :is="getCardIcon(card_type)" class="w-[75px] h-8 border border-gray-200 rounded-xl" />
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <p class="font-semibold text-black mr-4">{{ card_type }} ending in {{ props.creditCard.last_four }}</p>
                    <Tag v-if="is_default"
                        value="Default" 
                        class="border-2 border-green-positive-primary bg-white text-green-positive-primary rounded-lg py-1 pt-[5px] px-3 text-[10px] leading-[10px]"
                    />
                    <Tag v-if="props.creditCard.expiry_state === ExpiryState.EXPIRED"
                        value="Expired" 
                        class="border-2 border-danger-2 bg-white text-danger-2 rounded-lg py-1 pt-[5px] px-3 text-[10px] leading-[10px]"
                    />
                    <Tag v-if="props.creditCard.expiry_state === ExpiryState.NEAR_TO_EXPIRE"
                        value="Near to expire" 
                        class="border-2 border-pending bg-white text-pending rounded-lg pb-1 pt-[5px] px-3 text-[10px] leading-[10px]"
                    />
                </div>
                
                    
                <div class="flex gap-2">
                    <IconButton>
                        <template #icon>
                            <EditIconSVG class="w-4 h-4" />
                        </template>
                    </IconButton>

                    <IconButton>
                        <template #icon>
                            <TrashSVG class="w-4 h-4" />
                        </template>
                    </IconButton>
                </div>
            </div>
        </div>

        <div>
            <!-- <CreditCardPreview /> -->
            <div class="w-[87px] h-14 border bg-gray-400 rounded-lg"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        creditCard: CC_CARD
        isSelected: boolean
    }>()

    const { getCardIcon } = useCreditCards()

    const card_type = computed(() => props?.creditCard?.card_type || CardType.UNKNOWN)
    const is_default = ref(props.creditCard.is_default == '1')

    const border_style = computed(() => {
        if(props.isSelected) {
            if(props.creditCard.expiry_state === ExpiryState.EXPIRED) {
                return 'border-2 border-solid border-danger-1'
            }
            return 'border-2 border-solid border-[#9747FF]'
        } else if(is_default.value) {
            return 'border-dashed border-green-positive-primary'
        } else {
            return 'border-dashed border-[#9E9AA0]'
        }
    })
</script>