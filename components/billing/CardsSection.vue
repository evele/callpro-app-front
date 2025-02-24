<template>
    <div v-if="props.isLoading" class="flex gap-5">
        <Skeleton class="max-w-[540px] w-full rounded-2xl" height="224px"></Skeleton>
        <Skeleton class="max-w-[540px] w-full rounded-2xl" height="224px"></Skeleton>
    </div>

    <div v-else class="flex gap-5">
        <BillingCardContainer 
            v-if="current_plan?.current_package_type === PackageType.GROUPS_PLAN" 
            title="Your plan" 
            type="monthly"
        >
            <template #content>
                <div class="flex pl-6 w-full justify-between">
                    <MonthlySVG class="text-primary" />
                    <div class="w-[60%]">
                        <p class="flex items-center gap-3"><span class="font-semibold text-2xl">{{ current_plan?.numbers }}</span>numbers</p>
                    </div>
                </div>
            </template>

            <template #footer>
                <Button 
                    type="button" 
                    label="Change to Credits" 
                    class="bg-white tracking-wide leading-[10px] h-[28px] font-semibold border text-dark-3 text-xs hover:bg-gray-100"
                    @click="handle_select_credits"
                />
                <Button 
                    type="button"
                    label="Upgrade plan"
                    class="leading-[10px] tracking-wide font-semibold text-xs h-[28px]"
                    @click="handle_select_plan"
                />
            </template>
        </BillingCardContainer>

        <BillingCardContainer v-else title="Your plan" type="credits">
            <template #content>
                <div class="flex pl-6 w-full justify-between items-center">
                    <CreditsCoinsSVG />
                    <div class="w-[60%]">
                        <p class="flex items-center gap-3"><span class="font-semibold text-2xl">{{ balance_data ?? 0 }}</span>credits</p>
                    </div>
                </div>
            </template>

            <template #footer>
                <Button 
                    type="button" 
                    label="Select UMP" 
                    class="bg-white tracking-wide w-28 leading-[10px] h-[28px] font-semibold border text-dark-3 text-xs hover:bg-gray-100"
                    @click="handle_select_plan"
                />
                <Button 
                    type="button"
                    label="Add more credits"
                    class="leading-[10px] tracking-wide font-semibold text-xs h-[28px]"
                    @click="handle_select_credits"
                />
            </template>
        </BillingCardContainer>

        <BillingCardContainer v-if="default_cc_card" title="Payment method" type="card">
            <template #content>
                <div class="flex pl-6 w-full justify-between items-center">
                    <div v-if="!card_type || card_type === CardType.UNKNOWN" class="w-[75px]"></div>
                    <component v-else :is="getCardIcon(card_type)" class="w-[75px] border border-gray-200 rounded-xl" />

                    <p class="font-semibold text-lg flex flex-col">
                        {{ card_type }} ending in {{ default_cc_card?.last_four }}
                        <span v-if="default_cc_card.expiry_state === ExpiryState.EXPIRED" class="text-danger font-medium text-sm">
                            This card has expired
                        </span>
                        <span v-if="default_cc_card.expiry_state === ExpiryState.NEAR_TO_EXPIRE" class="text-pending font-medium text-sm">
                            This card is about to expire
                        </span>
                    </p>
                    
                    <Tag 
                        value="Default" 
                        class="border-2 border-green-positive-primary bg-white text-green-positive-primary rounded-lg py-[6px] text-xs leading-[10px] self-start"
                    />
                </div>
            </template>

            <template #footer>
                <Button 
                    type="button"
                    class="bg-dark-blue text-white rounded-xl hover:bg-gray-700"
                    @click="emit('hide-cards', true)"
                >
                    <EditIconSVG class="w-4 h-4" />
                    Edit
                </Button>
            </template>
        </BillingCardContainer>
    </div> 
</template>

<script setup lang="ts">
    const props = defineProps<{
        userPlanAndBalance: { user_current_plan: UserCurrentPlanData, balance_data: NumberOrNull } | null,
        userCardsData: CC_CARD[],
        isLoading: boolean
    }>()

    const emit = defineEmits<{
        'update:selected_type': [value: SelectedBillingType],
        'hide-cards': [value: boolean]
    }>()

    const { getCardIcon } = useCreditCards()

    const current_plan = computed(() => {
        if(!props.userPlanAndBalance) return null
        return props.userPlanAndBalance.user_current_plan
    })

    const balance_data = computed(() => {
        if(!props.userPlanAndBalance) return 0
        return props.userPlanAndBalance.balance_data
    })

    const default_cc_card = computed(() => {
        if(!props.userCardsData) return null
        return props.userCardsData.find((card: CC_CARD) => card.is_default == '1') || null
    })

    const card_type = computed(() => {
        if(!default_cc_card) return CardType.UNKNOWN
        return default_cc_card.value?.card_type
    })

    const handle_select_credits = () => emit('update:selected_type', 'credit')
    const handle_select_plan = () => emit('update:selected_type', 'plan')

</script>

<style scoped lang="scss">
    :deep(.p-skeleton) {
        background-color: rgb(197, 196, 196);
    }
</style>