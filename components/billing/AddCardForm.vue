<template>
    <Dialog v-model:visible="show_confirm" :draggable="false" :closable="false"
        pt:root:class="!border rounded-[30px] border-[#D9D9D9] !bg-white w-full max-w-[738px]" pt:mask:class="bg-white bg-opacity-70 backdrop-blur-[2px]"
    >   
        <template #container>
            <div class="w-full flex items-center justify-between px-8 py-9 rounded-t-xl mb-2 bg-gradient-to-br from-neutral-700 to-neutral-400">
                <h2 class="font-bold text-2xl text-dark-3">{{ props.title }}</h2>
                <Paycard :value-fields="valueFields" @get-type="changeType" :isCardNumberMasked="isCardNumberMasked" :current-focus="currentFocus" />
            </div>
            <div>
            <p class="py-7 pl-9 text-Dark-3 text-lg font-semibold leading-relaxed">Add new card</p>
            <divider class="m-0"/>
            <form ref="cardForm" @submit.prevent class="js-card-form new-contact-form flex px-8 py-6 flex-col gap-5 sm:gap-6" data-encryptedfields="encrypted-form">
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label :for="inputFields.cardNumber" class="text-dark-3 text-sm">Card Number</label>
                        <InputMask :id="inputFields.cardNumber" v-model="valueFields.cardNumber" mask="9999 9999 9999 9999" placeholder="#### #### #### ####" class="w-full mt-1 text-dark-3" data-card-field/>      
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label :for="inputFields.cardName" class="text-dark-3 text-sm">Full Name</label>
                        <InputText  :id="inputFields.cardName" v-model="valueFields.cardName" type="text"  placeholder="Johh Doe" class="w-full mt-1 text-dark-3" data-card-field />
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label :for="inputFields.cardExpiry" class="text-dark-3 text-sm">Expiry</label>
                        <InputMask  :id="inputFields.cardExpiry" name="checkout-cc-expiry" v-model="valueFields.cardExpiry" mask="99 / 99" placeholder="MM / YY" class="w-full mt-1 text-dark-3" data-card-field/>
                        <Message v-if="cardExpiryError" severity="error" class="mt-1 pl-4" size="small" variant="simple">{{ cardExpiryError }}</Message>
                    </div>
                    <div class="w-full">
                        <label :for="inputFields.cardCvv" class="text-dark-3 text-sm">CVV</label>
                        <InputMask :id="inputFields.cardCvv" v-model="valueFields.cardCvv" mask="999?9" placeholder="***" class="w-full mt-1 text-dark-3"  data-card-field/>
                    </div>
                </div>
            </form>
            </div>
            <div class="flex justify-between mt-9 gap-4 font-medium px-8 pb-6">
                <Button 
                    @click="handle_cancel"
                    :disabled="props.isProcessingConfirm || props.isProcessingCancel"
                    class="bg-[#F5F5F5] border border-grey-14 text-dark-3 h-10 w-full max-w-[300px] hover:bg-[#E5E5E5]"
                >
                    <div class="flex items-center gap-2" v-if="props.isProcessingCancel">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 dark-spinner" animationDuration=".5s" aria-label="Processing" />
                        Processing...
                    </div>
                    <span v-else>{{ props.cancelText }}</span>
                </Button>

                <Button 
                    @click="handle_confirm"
                    :disabled="props.isProcessingConfirm || props.isProcessingCancel"
                    class="bg-primary border-primary text-white w-full max-w-[300px] h-10 hover:bg-[#4A1D6E] disabled:bg-primary"
                >
                    <div class="flex items-center gap-2" v-if="props.isProcessingConfirm">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner" animationDuration=".5s" aria-label="Processing" />
                        Processing...
                    </div>
                    <span v-else>{{ props.confirmText }}</span>
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
  
    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const { mutate: addNewCard, isPending: isAddingCard } = useAddNewCard()
    
    const props = withDefaults(defineProps<{
        isVisible: boolean
        title?: string
        message?: string
        cancelText?: string
        confirmText?: string
        isProcessingConfirm?: boolean
        isProcessingCancel?: boolean 
    }>(), {
        title: '',
        message: '',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        isProcessingConfirm: false,
        isProcessingCancel: false
    })

    const show_confirm = computed(() => props.isVisible)

    const emit = defineEmits(['close', 'cancel', 'confirm'])
    const handle_cancel = () =>  emit('cancel',false)

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
    
    const changeType = (type: CardType) => {
        console.log(type) // TODO: ask Eduardo about this
    }


    const cardExpiryError = ref('')

    watch(() => valueFields.cardExpiry, (value) => {
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

        console.log(cardExpiryError.value)
    })

    const { encryptCardData } = useCardEncryption()

    function handle_confirm() {

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
                    } else {
                        show_error_toast('Error', response.error || 'Something went wrong while downgrading user plan.')
                    }
                },
                onError: () => show_error_toast('Error', 'Something went wrong while downgrading user plan.')
        })
    }
        
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