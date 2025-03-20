<template>
    <Dialog v-model:visible="show_confirm" :draggable="false" :closable="false"
        pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-full max-w-[580px]" pt:mask:class="bg-white bg-opacity-70 backdrop-blur-[2px]"
    >
        <template #container>
            <header class="w-full flex items-center justify-between px-8 pt-6 mb-2">
                <h2 class="font-bold text-2xl text-dark-3">{{ props.title }}</h2>
            </header>
            <Paycard :value-fields="valueFields" @get-type="changeType" :isCardNumberMasked="isCardNumberMasked" :current-focus="currentFocus" />

            <form ref="cardForm" @submit.prevent class="js-card-form new-contact-form flex px-4 flex-col gap-5 sm:gap-6" data-encryptedfields="encrypted-form">
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label for="number" class="text-dark-3">Card Number</label>
                        <InputText id="number" v-model="cc_number" type="text" placeholder="#### #### #### ####" class="w-full mt-1" />
                        <input  class="w-full mt-1" id="enc-number" v-model="cc_number" type="text" data-encryptedfields="cc" placeholder="**** **** **** ****">
                        <input ref="xCardNumRef" name="xCardNum" type="hidden" v-model="encryptedValue" />
                        
                    </div>
                    
                </div>
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label :for="inputFields.cardName" class="text-dark-3">Full Name</label>
                        <InputText  :id="inputFields.cardName" v-model="valueFields.cardName" type="text"  placeholder="Johh Doe" class="w-full mt-1" data-card-field />
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label for="expiry" class="text-dark-3">Expiry</label>
                        <InputMask  :id="inputFields.cardMonth" name="checkout-cc-expiry" v-model="valueFields.cardMonth" mask="99 / 99" placeholder="MM / YY" class="w-full mt-1" />
                    </div>
                    <div class="w-full">
                        <label for="cvv" class="text-dark-3">CVV</label>
                        <InputMask :id="inputFields.cardCvv" v-model="valueFields.cardCvv" mask="999?9" placeholder="***" class="w-full mt-1" />
                    </div>
                </div>
            </form>
            
            <!--
            <form class='js-card-form' data-encryptedfields="encrypted-form">
                <div class="form-group">
                    <div class="col-xs-12">
                        <div class="form-material">
                            <label for="number">Number</label>
                            <input class="form-control" id="number" type="text" placeholder="**** **** **** ****">
                            <input class="form-control hidden" id="enc-number" type="text" data-encryptedfields="cc" placeholder="**** **** **** ****">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-xs-12">
                        <div class="form-material">
                            <label for="cc-name">Full Name</label>
                            <input class="form-control" id="cc-name" name="checkout-cc-name" type="text" placeholder="JOHN DOE">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-xs-6">
                        <div class="form-material">
                            <label for="expiry">MMYY</label>
                            <input class="form-control" id="expiry" name="checkout-cc-expiry" type="text" placeholder="0119">
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="form-material">
                            <label for="cvv">CVC</label>
                            <input class="form-control" id="cvv" data-encryptedfields="cvv" type="text" placeholder="***">
                        </div>
                    </div>
                </div>

            </form> 
            -->

            <footer class="flex justify-end gap-4 font-medium px-8 pb-6 mt-6">
                <Button 
                    @click="handle_cancel"
                    :disabled="props.isProcessingConfirm || props.isProcessingCancel"
                    class="bg-[#F5F5F5] border border-grey-14 text-dark-3 rounded-lg w-fit h-10 sm:max-w-[300px] hover:bg-[#E5E5E5]"
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
                    class="bg-primary rounded-lg border-primary text-white w-fit sm:max-w-[300px] h-10 hover:bg-[#4A1D6E] disabled:bg-primary"
                >
                    <div class="flex items-center gap-2" v-if="props.isProcessingConfirm">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner" animationDuration=".5s" aria-label="Processing" />
                        Processing...
                    </div>
                    <span v-else>{{ props.confirmText }}</span>
                </Button>
            </footer>
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
        title: 'Confirm your purchase',
        message: 'Are you sure you want to confirm this purchase?',
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
        cardCvv: ""
    })

    const inputFields = reactive({
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
    })

    const currentFocus = ref<string | null>(null)

    const isCardNumberMasked = ref(false)
    
    const changeType = (type: CardType) => {
        console.log(type)
    }

    /* -- */


  
    const cc_number = ref('')

    const expiry = ref('')
    const encryptedValue = ref('')

    const { encryptCardData } = useCardEncryption()

    function handle_confirm() {
    // Aquí se llama a la función para obtener el valor encriptado
    encryptedValue.value = encryptCardData(cc_number.value, valueFields.cardCvv)
    // Luego puedes enviar el formulario o realizar otras acciones
    console.log('Valor encriptado:', encryptedValue.value)

    const data_to_send: New_CC = {
        number: Number(cc_number.value),
        cc_name: valueFields.cardName,
        expiry: expiry.value,
        cvv: Number(valueFields.cardCvv),
        enc_card: encryptedValue.value,

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