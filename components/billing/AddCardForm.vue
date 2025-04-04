<template>
    <Dialog v-model:visible="show_confirm" :draggable="false" :closable="false"
        pt:root:class="!border rounded-[30px] border-[#D9D9D9] !bg-white w-full max-w-[738px]" pt:mask:class="bg-white bg-opacity-70 backdrop-blur-[2px]"
    >   
        <template #container>
            <div class="w-full flex items-center justify-between px-8 py-9 rounded-t-xl mb-2 bg-gradient-to-br from-neutral-700 to-neutral-400">
                <h2 class="font-bold text-2xl text-dark-3">{{ props.title }}</h2>
                <Paycard 
                    :value-fields="valueFields" 
                    @get-type="changeType" 
                    :isCardNumberMasked="isCardNumberMasked" 
                    :current-focus="currentFocus"
                    :is-editing="is_editing"
                    :encrypted-number="is_editing ? encrypted_cc_number : null"
                    :set-type="is_editing ? props.cardToEdit?.card_type : CardType.UNKNOWN"
                />
            </div>
            <div>
            <p class="py-7 pl-9 text-Dark-3 text-lg font-semibold leading-relaxed">{{ modal_title }}</p>
            <divider class="m-0"/>
            <form ref="cardForm" @submit.prevent class="js-card-form new-contact-form flex px-8 py-6 flex-col gap-5 sm:gap-6" data-encryptedfields="encrypted-form">
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label :for="inputFields.cardNumber" class="text-dark-3 text-sm">Card Number</label>
                        <!-- 
                            <InputMask :id="inputFields.cardNumber" v-model="valueFields.cardNumber" mask="9999 9999 9999 9999" placeholder="#### #### #### ####" class="w-full mt-1 text-dark-3" data-card-field/>      
                            -->
                        <InputText 
                            :id="inputFields.cardNumber"
                            :value="is_editing ? encrypted_cc_number : valueFields.cardNumber"
                            @input="changeNumber"
                            class="w-full mt-1 text-dark-3"
                            placeholder="#### #### #### ####"
                            data-card-field
                            :maxlength="cardNumberMaxLength"
                            :disabled="is_editing"
                        />
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label :for="inputFields.cardName" class="text-dark-3 text-sm">Full Name</label>
                        <InputText :id="inputFields.cardName" v-model="valueFields.cardName" type="text" placeholder="Johh Doe" class="w-full mt-1 text-dark-3" data-card-field :disabled="is_editing" />
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label :for="inputFields.cardExpiry" class="text-dark-3 text-sm">Expiry</label>
                        <InputMask :id="inputFields.cardExpiry" name="checkout-cc-expiry" v-model="valueFields.cardExpiry" mask="99 / 99" placeholder="MM / YY" class="w-full mt-1 text-dark-3" data-card-field/>
                        <Message v-if="cardExpiryError" severity="error" class="mt-1 pl-4" size="small" variant="simple">{{ cardExpiryError }}</Message>
                    </div>
                    <div class="w-full">
                        <label :for="inputFields.cardCvv" class="text-dark-3 text-sm">CVV</label>
                        <InputMask :id="inputFields.cardCvv" slot-char="*" v-model="valueFields.cardCvv" :mask="expiry_mask" placeholder="***" class="w-full mt-1 text-dark-3"  data-card-field/>
                    </div>
                </div>
            </form>
            </div>
            <div class="flex justify-between mt-9 gap-4 font-medium px-8 pb-6">
                <Button 
                    @click="handle_cancel"
                    :disabled="is_saving_card"
                    class="bg-[#F5F5F5] border border-grey-14 text-dark-3 h-10 w-full max-w-[300px] hover:bg-[#E5E5E5]"
                >
                    <span>Cancel</span>
                </Button>

                <Button 
                    @click="handle_confirm"
                    :disabled="is_saving_card || disable_confirm"
                    class="bg-primary border-primary text-white w-full max-w-[300px] h-10 hover:bg-[#4A1D6E] disabled:bg-primary"
                >
                    <div class="flex items-center gap-2" v-if="is_saving_card">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner" animationDuration=".5s" aria-label="Processing" />
                        Processing...
                    </div>
                    <span v-else>Confirm</span>
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const { show_success_toast, show_error_toast } = usePrimeVueToast();
    const { mutate: addNewCard, isPending: isAddingCard } = useAddNewCard()
    const { mutate: editCard, isPending: isEditingCard } = useEditCard()
    
    const props = withDefaults(defineProps<{
        isVisible: boolean
        cardToEdit?: CC_CARD | null
    }>(), {
        cardToEdit: null
    })

    const show_confirm = computed(() => props.isVisible)
    const is_editing = computed(() => props.cardToEdit !== null && props.cardToEdit !== undefined)
    const modal_title = computed(() => is_editing.value ? 'Edit your card' : 'Add new card')
    const encrypted_cc_number = ref('**** **** ****')

    const emit = defineEmits(['cancel', 'confirm'])

    const handle_cancel = () => {
        emit('cancel',false)
        Object.assign(valueFields, {
            cardName: "",
            cardNumber: "",
            cardMonth: "",
            cardYear: "",
            cardExpiry: "",
            cardCvv: ""
        })
    }

    const is_saving_card = computed(() => isAddingCard.value || isEditingCard.value)
    const disable_confirm = computed(() => {
        if(is_editing.value) {
            return !valueFields.cardExpiry || valueFields.cardCvv.replace(/[^0-9]/g, '').length < 3 || cardExpiryError.value.length
        }
        return !valueFields.cardNumber || !valueFields.cardName || !valueFields.cardExpiry || valueFields.cardCvv.replace(/[^0-9]/g, '').length < 3 || cardExpiryError.value.length
    })

    /* -- */
    const valueFields = reactive({
        cardName: "",
        cardNumber: "",
        cardMonth: "",
        cardYear: "",
        cardExpiry: "",
        cardCvv: ""
    })
    
    const inputFields = reactive({
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardExpiry: 'v-card-expiry',
        cardCvv: 'v-card-cvv'
    })

    const currentFocus = ref<string | null>(null)
    const isCardNumberMasked = ref(false)
    const expiry_mask = ref('999')
    
    const changeType = (type: CardType) => {
        expiry_mask.value = '999'
        if (type == CardType.AMERICAN_EXPRESS){
           expiry_mask.value = '9999'
        } 
    }

    const cardExpiryError = ref('')

    watch(() => props.isVisible, (value: boolean) => {
        if(value && props.cardToEdit) {
            valueFields.cardName = props.cardToEdit.cc_name
            encrypted_cc_number.value = `**** **** **** ${props.cardToEdit.last_four}`
        }
    })

    watch(() => valueFields.cardExpiry, (value: string) => {
        cardExpiryError.value = ''

        const clean = value.replace(/\s/g, '')
        const match = /^(\d{2})\/?(\d{2})$/.exec(clean)

        valueFields.cardMonth = valueFields.cardExpiry.substring(0,2)
        valueFields.cardYear = valueFields.cardExpiry.substring(5,7)

        if (!match) {
            cardExpiryError.value = ''
            return
        }

        const [_, mm, yy] = match
        const month = parseInt(mm, 10)
        const year = parseInt(yy, 10)

        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear() % 100

        if (month < 1 || month > 12) {
            cardExpiryError.value = 'Invalid month'
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            cardExpiryError.value = 'Expired card'
        }
    })

    const maxLengthAmex = 17
    const maxLengthDiners = 16
    const maxLengthOthers = 19

    const cardNumberMaxLength = ref(maxLengthOthers)

    const changeNumber = (e: Event) => {
        const inputEvent = e as InputEvent;
        const target = e.target as HTMLInputElement;
        target.value = target.value.replace(/\D/g, '');
        valueFields.cardNumber = target.value

        const cardPatterns: Record<CardType, RegExp> = {
            [CardType.VISA]: /^4/,
            [CardType.MASTERCARD]: /^(?:5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/,
            [CardType.AMERICAN_EXPRESS]: /^3[47]/,
            [CardType.DISCOVER]: /^6011|^64[4-9]|^65/,
            [CardType.JCB]: /^35/,
            [CardType.DINERS_CLUB]: /^3(0[0-5]|[68])/,
            [CardType.MAESTRO]: /^(?:50(?:18|20|38)|5[6-9]|6\d)/,
            [CardType.UNIONPAY]: /^62/,
            [CardType.UNKNOWN]: /.*/, // Fallback to avoid undefined
        };

        const value = valueFields.cardNumber;

        if (cardPatterns[CardType.AMERICAN_EXPRESS].test(value)) {
            cardNumberMaxLength.value = maxLengthAmex;
        } else if (cardPatterns[CardType.DINERS_CLUB].test(value)) {
            cardNumberMaxLength.value = maxLengthDiners;
        } else {
            cardNumberMaxLength.value = maxLengthOthers;
        }

        const trimmedValue = value.slice(0, cardNumberMaxLength.value);

        if (cardNumberMaxLength.value === maxLengthAmex) { // American Express
            valueFields.cardNumber = trimmedValue
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        } else if (cardNumberMaxLength.value === maxLengthDiners) { // Diner's Club
            valueFields.cardNumber = trimmedValue
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        } else { // Rest of the cards
            valueFields.cardNumber = trimmedValue
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
                .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
        }

        if (inputEvent.inputType == 'deleteContentBackward') {
            const lastChar = valueFields.cardNumber.substring(valueFields.cardNumber.length, valueFields.cardNumber.length - 1)
            if (lastChar == ' ') { valueFields.cardNumber = valueFields.cardNumber.substring(0, valueFields.cardNumber.length - 1) }
        }
    }

    const { encryptCardData } = useCardEncryption()

    function handle_add_card() {

        const data_to_send: New_CC = {
            number: Number(valueFields.cardNumber.replace(/ /g, '')),
            cc_name: valueFields.cardName,
            expiry: valueFields.cardExpiry,
            cvv: Number(valueFields.cardCvv),
            enc_card: encryptCardData(valueFields.cardNumber.replace(/ /g, ''), valueFields.cardCvv),
        }

        addNewCard(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_success_toast('Success', 'Credit Card added successfully.')
                    handle_cancel()
                } else {
                    show_error_toast('Error', response.error || 'Something went wrong while adding credit card.')
                }
            },
            onError: () => show_error_toast('Error', 'Something went wrong while adding credit card.')
        })
    }

    const handle_edit_card = () => {
        if(!props.cardToEdit) return

        const data_to_send: EditCardParams = {
            card_id: props.cardToEdit.id,
            expiry: valueFields.cardExpiry,
            cvv: Number(valueFields.cardCvv),
        }

        editCard(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_success_toast('Success', 'Credit Card edited successfully.')
                    handle_cancel()
                } else {
                    show_error_toast('Error', response.error || 'Something went wrong while editing credit card.')
                }
            },
            onError: () => show_error_toast('Error', 'Something went wrong while editing credit card.')
        })
    }

    const handle_confirm = () => is_editing.value ? handle_edit_card() : handle_add_card();
        
</script>
<style scoped lang="scss">
    :deep(.light-spinner) {
        .p-progressspinner-circle {
            stroke: white!important;
        }
    }
    :deep(.dark-spinner) {
        .p-progressspinner-circle {
            stroke: #757575!important;
        }
    }
</style>