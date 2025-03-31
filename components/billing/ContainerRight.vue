<template>
    <aside class="flex flex-col justify-center gap-4 self-start">
        <PlanCardSummary v-show="selected_type === CREDIT">
            <template #content>
                <div class="flex gap-6 w-full justify-center items-center">
                    <CreditsCoinsSVG />
                    <div class="text-center">
                        <p class="font-semibold text-2xl">1233.68</p>
                        <p class="text-xs text-grey-4">credits</p>
                    </div>
                </div>
            </template>
            <template #footer>
                <Button 
                    type="button" 
                    label="Change to Plan" 
                    class="bg-white tracking-wide leading-[10px] h-[28px] mt-6 font-semibold border text-dark-3 text-xs hover:bg-gray-100 mx-auto"
                    @click="handle_selected_type(PLAN)"
                />
            </template>
        </PlanCardSummary>

        <PlanCardSummary v-show="selected_type === PLAN">
            <template #content>
                <div class="flex flex-col w-full justify-center items-center">
                    <div class="flex items-center gap-6" :class="{ 'mb-9': !is_monthly_plan }">
                        <UserSVG class="text-primary" />
                        <p v-if="is_monthly_plan" class="font-semibold text-2xl">{{ current_plan?.numbers }}</p>
                        <p v-else class="font-semibold text-2xl text-grey-4">0</p>
                    </div>
                    <p v-if="is_monthly_plan" class="text-xs text-grey-4 mt-4">Expires: {{ format_timestamp(current_plan?.end_date ?? '', false) }}</p>
                </div>
            </template>
            <template v-if="is_monthly_plan && current_plan?.pending_downgrade_package_type == null" #footer>
                <Button 
                    type="button" 
                    label="Cancel" 
                    class="bg-white tracking-wide leading-[10px] h-[28px] w-[120px] font-semibold border text-dark-3 text-xs hover:bg-gray-100 mx-auto"
                    @click="open_confirm" 
                />
            </template>
        </PlanCardSummary>
                
        <PanelRecap :selected-type="selected_type" @update:sectionToShow="emit('update:sectionToShow', $event)" />
    </aside>

    <ConfirmationPurchase 
        :is-visible="show_confirmation_modal" 
        @close="show_confirmation_modal = false" 
        @cancel="handle_set_pending_downgrade(true)" 
        @confirm="handle_set_pending_downgrade(false)" 
        title="Confirm your cancelation" 
        message="Are you sure you want to cancel your Unlimited Monthly Plan"
        cancel-text="Cancel now" 
        confirm-text="Cancel when expires"
        :is-processing-confirm="isDowngrading && !is_cancel_now"
        :is-processing-cancel="isDowngrading && is_cancel_now"
    />
    <MessageReady :is-visible="show_ready_message" />
</template>

<script setup lang="ts">
    const { mutate: setPendingDowngrade, isPending: isDowngrading } = useSetPendingDowngrade()
    const { mutate: cancelDowngrade, isPending: isCancelDowngrade } = useCancelDowngrade()

    const props = defineProps<{
        selectedType: SelectedBillingType
        userPlanAndBalance: { user_current_plan: UserCurrentPlanData, balance_data: NumberOrNull } | null
    }>()

    const emit = defineEmits<{
        'update:selectedType': [value: SelectedBillingType]
        'update:sectionToShow': [value: BillingSectionToShow]
    }>()

    const billingStore = useBillingStore()
    const { show_error_toast } = usePrimeVueToast();

    const show_confirmation_modal = ref(false)
    const show_ready_message = ref(false)

    const selected_type = computed<SelectedBillingType>(() => props.selectedType)

    const current_plan = computed(() => {
        if(!props.userPlanAndBalance) return null
        return props.userPlanAndBalance.user_current_plan
    })

    const is_monthly_plan = computed(() => current_plan.value?.current_package_type === PackageType.GROUPS_PLAN)

    const handle_selected_type = (select_type: SelectedBillingType) => {
        billingStore.resetStore()
        emit('update:selectedType', select_type)
    }

    /* ----- Cancel plan ----- */
    const is_cancel_now = ref(false)
    const open_confirm = () => show_confirmation_modal.value = true

    const handle_set_pending_downgrade = (now: boolean) => {
        is_cancel_now.value = now
        const data_to_send: PendingDowngradeData = {
            now,
            package_type: PackageType.FREE_PLAN,
            package_id: 0
        }

        setPendingDowngrade(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_confirmation_modal.value = false
                    show_ready_message.value = true
                    setTimeout(() => {
                        show_ready_message.value = false
                    }, 2000)
                } else {
                    show_error_toast('Error', response.error || 'Something went wrong while downgrading user plan.')
                }
            },
            onError: () => show_error_toast('Error', 'Something went wrong while downgrading user plan.')
        })
    }
</script>