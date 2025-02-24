<template>
    <Card class="bg-white w-full h-90 rounded-2xl p-4">
        <template #content>
            <div class="flex gap-6 justify-between mb-6">
                <div class="flex flex-col w-full max-w-[500px] gap-10">
                    <div class="flex items-center gap-5">
                        <Button 
                            type="button" 
                            class="bg-primary border-none rounded-full p-0 h-[18px] w-[18px] bg-gradient-to-b from-[#9747FF] to-[#532CB5] hover:scale-110 transition-transform" 
                            @click="open_modal"
                            raised
                        >
                            <PlusSVG class="w-[14px] h-[14px] text-white" />
                        </Button>
                        <p class="text-dark-3 text-xl font-medium">Select a card</p>
                    </div>
                    
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
                                <li class="flex items-center justify-between text-sm">Credit Pack <span>{{ format_price(6250) }}</span></li>
                                <li class="mt-4 flex items-center justify-between text-sm">Discount <span>{{ format_price(4750) }}</span></li>
                                <li class="mt-4 flex items-center justify-between text-sm">Promo Code <span>{{ format_price(0) }}</span></li>
                            </ul>

                            <Divider class="bg-grey-6 h-[2px] rounded-full" />

                            <div class="flex justify-between font-semibold text-sm">
                                <p>Total</p>
                                <p>{{ format_price(6250 - 4750) }}</p>
                            </div>
                        </div>

                        <div class="flex justify-end w-full items-center gap-4 mt-6">
                            <label for="promo-code" class="font-semibold text-sm text-dark-3">Promo Code</label>
                            <InputText 
                                id="promo-code"
                                class="w-32 py-3 border rounded-xl h-10 placeholder-grey-7"
                                placeholder="Enter Code" 
                                v-model="promo_code"
                            />
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

const show_confirmation_modal = ref(false)
const show_ready_message = ref(false)
const is_purchasing = ref(false)

const selected_card = ref(null)
const card_options = ref([
    { text: 'XXXX XXXX XXXX 7794', value: 1 },
    { text: 'XXXX XXXX XXXX 6032', value: 2 },
    { text: 'XXXX XXXX XXXX 5539', value: 3 },
])

const promo_code = ref('')

const open_modal = () => {
    console.log('open modal')
}

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

</script>
<style scoped lang="scss">
:deep(.placeholder-color) {
    .p-select-label.p-placeholder {
        color: #B3B3B3;
    }
}
</style>