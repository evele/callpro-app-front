<template>
    <Card class="bg-white w-full h-90 rounded-2xl p-4">
        <template #content>
            <div class="flex gap-6 justify-between mb-6">
                <div class="flex flex-col w-full max-w-[500px] gap-10">
                    <div class="flex items-center gap-5">
                        <Button type="button" class="text-dark-3 bg-transparent rounded-full p-0 w-6 h-6 shadow-md border-grey-14 hover:bg-gray-200" @click="emit('update:sectionToShow', B_BUY_CREDITS)">
                            <ArrowLeftSVG class="w-[7px] h-[7px]" />
                        </Button>
                        <p class="text-dark-3 text-xl font-medium">Select a card</p>
                    </div>
                    
                    <div class="flex flex-col gap-4">
                        <div>
                            <label for="card-select" class="text-dark-3 text-sm font-medium">Card Number</label>
                            <Select 
                                id="card-select"
                                v-model="selected_card" 
                                :options="card_options" 
                                optionLabel="text" 
                                optionValue="value" 
                                class="w-full text-sm py-[2px] mt-[6px]"
                                :class="{'placeholder-color': !selected_card}"
                                placeholder="XXXX XXXX XXXX XXXX" 
                            />
                        </div>

                        <div class="flex items-center gap-3">
                            <Button 
                                type="button" 
                                class="bg-primary border-none rounded-full p-0 h-[14px] w-[14px] bg-gradient-to-b from-[#9747FF] to-[#532CB5] hover:scale-110 transition-transform" 
                                @click="emit('add-card',true)"
                                raised
                            >
                                <PlusSVG class="w-2 h-2 text-white" />
                            </Button>
                            <p class="text-dark-3 text-xs font-semibold">Add new card</p>
                        </div>
                    </div>

                    <div>
                        <h5 class="text-dark-3 text-lg font-medium mb-6">Plan description</h5>
                        <ul class="text-sm text-dark-3 list-disc font-medium pl-4">
                            <li class="mb-4">50,000 credits, available to spend in Audio Broadcasts, Text Broadcasts, and Chat Messages to any contact or phone number.</li>
                            <li class="mb-4">
                                The cost for any category is:
                                <div class="mt-4">Audio Broadcast $0.08 // Text Broadcast $0.08 // Chat message $1.00</div>
                            </li>
                            <li>There is no expiring date for using your credits.</li>
                        </ul>
                    </div>

                    
                </div>

                <div class="flex flex-col max-w-[450px] w-full rounded-xl overflow-hidden">
                    <CreditCardPreview :card="selected_card" />
                    <section class="bg-light-2 p-4 pb-6 w-full flex flex-col justify-between">
                        <div class="text-dark-3">
                            <h4 class="font-semibold text-lg">Recap</h4>

                            <ul class="font-semibold mt-8">
                                <li class="flex items-center justify-between text-sm">Credit Pack <span>{{ format_price(recap_data.pack_info) }}</span></li>
                                <li class="mt-4 flex items-center justify-between text-sm">Discount <span>{{ format_price(recap_data.discount) }}</span></li>
                                <li class="mt-4 flex items-center justify-between text-sm">Promo Code <span>{{ format_price(applied_coupon.discount_amount) }}</span></li>
                            </ul>

                            <Divider class="bg-grey-6 h-[2px] rounded-full" />

                            <div v-show="applied_coupon.coupon" class="flex justify-between font-semibold text-sm mb-3">
                                <p>Coupon: <span class="font-normal">{{ applied_coupon.coupon }}</span></p>
                                <p>{{ applied_coupon.discount_display }} Off</p>
                            </div>

                            <div class="flex justify-between font-semibold text-sm">
                                <p>Total</p>
                                <p v-if="applied_coupon.coupon">{{ format_price(applied_coupon.final_price) }}</p>
                                <p v-else>{{ format_price(recap_data.total) }}</p>
                            </div>
                        </div>

                        <div class="flex w-full items-center gap-4 mt-6">
                            <label for="promo-code" class="font-semibold text-sm text-dark-3">Promo Code</label>
                            <InputText 
                                id="promo-code"
                                class="w-32 py-3 border rounded-xl h-9 placeholder-grey-7 text-sm"
                                placeholder="Enter Code" 
                                v-model="coupon"
                            />
                            <Button 
                                type="button" 
                                class="bg-black disabled:bg-[#322F35] text-white text-sm rounded-xl font-medium h-9 shadow-xl hover:bg-gray-900"
                                :disabled="disable_apply_btn"
                                @click="handle_apply_coupon"
                            >
                                <ProgressSpinner v-if="isFetching" strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner" animationDuration=".5s" aria-label="Applying coupon" />
                                <span v-else>Apply</span>
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </template>
        <template #footer>
            <Button 
                @click="open_confirm" 
                :disabled="!selected_card" 
                class="bg-primary text-sm rounded-xl font-medium h-10 border-white text-white w-full hover:bg-[#4A1D6E] shadow-xl disabled:hover:bg-primary"
            >
                Confirm purchase
            </Button>
        </template>
    </Card>

    <ConfirmationPurchase 
        :is-visible="show_confirmation_modal" 
        @close="close_confirm" 
        @confirm="handle_confirm" 
        title="Confirm your purchase" 
        message="Are you sure you want to confirm this purchase?"  
        :isProcessingConfirm="is_purchasing"
    />
    <MessageReady :is-visible="show_ready_message" />
</template>

<script setup lang="ts">
const billingStore = useBillingStore()
const { show_success_toast, show_error_toast } = usePrimeVueToast();

const emit = defineEmits<{
    (event: 'update:sectionToShow', value: BillingSectionToShow): void
    (event: 'add-card', value: boolean): void
}>()

const recap_data = computed<RecapData>(() => billingStore.recap_data)
const is_credit = computed(() => billingStore.selected_plan === null)

const show_confirmation_modal = ref(false)
const show_ready_message = ref(false)
const is_purchasing = ref(false)

const selected_card = ref(null)
const card_options = ref([
    { text: 'XXXX XXXX XXXX 7794', value: 1 },
    { text: 'XXXX XXXX XXXX 6032', value: 2 },
    { text: 'XXXX XXXX XXXX 5539', value: 3 },
])

const coupon = ref('')

const open_confirm = () => {
    show_confirmation_modal.value = true
}

const close_confirm = () => show_confirmation_modal.value = false

const handle_confirm = () => {
    is_purchasing.value = true
    setTimeout(() => {
        is_purchasing.value = false
        show_confirmation_modal.value = false
        show_ready_message.value = true
        setTimeout(() => {
            show_ready_message.value = false
        }, 2000)
    }, 2000)
}

const disable_apply_btn = computed(() => !coupon.value || isFetching.value)

const coupon_query_params = computed(() => {
    let package_id
    let package_type
    if(is_credit.value) {
        package_id = billingStore?.selected_step?.package_id
        package_type = PackageType.PAUG_PLAN
    } else {
        package_id = billingStore?.selected_plan?.id
        package_type = PackageType.GROUPS_PLAN
    }
    return {
        coupon: coupon.value,
        package_id: package_id,
        package_type: package_type,
        price: recap_data.value.total
    }
})

type AppliedCoupon = {
    coupon: string
    discount_amount: number
    discount_display: string
    final_price: number
}
const applied_coupon: AppliedCoupon = reactive({
    coupon: '',
    discount_amount: 0,
    discount_display: '',
    final_price: 0,
})

const { isFetching, refetch: checkCoupon } = useFetchCheckCoupon(coupon_query_params)
const handle_apply_coupon = async () => {
    if (!coupon.value) return
    
    const res = await checkCoupon()
    if(res?.data?.result) {
        show_success_toast('Success', 'Coupon applied successfully!')
        coupon.value = ''
        const { couponCode, discountAmount, discountDisplay, finalPrice } = res.data.coupon_data
        applied_coupon.coupon = couponCode
        applied_coupon.discount_amount = discountAmount
        applied_coupon.discount_display = discountDisplay
        applied_coupon.final_price = finalPrice
    } else {
        show_error_toast('Error', res.data.error || 'Invalid Coupon Code!')
    }
}

</script>

<style scoped lang="scss">
:deep(.placeholder-color) {
    .p-select-label.p-placeholder {
        color: #B3B3B3;
    }
}
:deep(.light-spinner) {
    .p-progressspinner-circle {
        stroke: white!important;
    }
}
</style>