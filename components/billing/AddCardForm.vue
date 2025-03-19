<template>
    <Dialog v-model:visible="show_confirm" :draggable="false" :closable="false"
        pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-full max-w-[580px]" pt:mask:class="bg-white bg-opacity-70 backdrop-blur-[2px]"
    >
        <template #container>
            <header class="w-full flex items-center justify-between px-8 pt-6 mb-2">
                <h2 class="font-bold text-2xl text-dark-3">{{ props.title }}</h2>
            </header>

            <form ref="cardForm" @submit.prevent class="js-card-form new-contact-form flex px-4 flex-col gap-5 sm:gap-6" data-encryptedfields="encrypted-form">
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label for="number" class="text-dark-3">Number</label>
                        <InputText id="number"  type="text" placeholder="**** **** **** ****" class="w-full mt-1" />
                        <input  class="w-full mt-1" id="enc-number" v-model="cc_number" type="text" data-encryptedfields="cc" placeholder="**** **** **** ****">
                        <input ref="xCardNumRef" name="xCardNum" type="hidden" v-model="encryptedValue" />

                    </div>
                    
                    <div class="w-full">
                        <label for="cc-name" class="text-dark-3">Full Name</label>
                        <InputText  type="text" id="cc-name" name="checkout-cc-name" v-model="cc_name"  placeholder="Johh Doe" class="w-full mt-1" />
                    </div>
                </div>
                <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                    <div class="w-full">
                        <label for="expiry" class="text-dark-3">Expiry</label>
                        <input  type="text" id="expiry" name="checkout-cc-expiry" v-model="expiry" placeholder="0119" class="w-full mt-1" />
                    </div>
                    <div class="w-full">
                        <label for="cvv" class="text-dark-3">CVV</label>
                        <input  type="text"  id="cvv" data-encryptedfields="cvv"  v-model="cvv" placeholder="***" class="w-full mt-1" />
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
    /*
    declare global {
        interface Window {
            EncryptedFields: any;
        }
    }
            
    useHead({
        script: [
            { src: 'https://cdn.cardknox.com/js/v1/encryptedfields.js', async: true, defer: true }
        ]
    }) 


    // const cardForm = ref<HTMLFormElement | null>(null)
    */
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
    /*
    const cc_number = ref("")
    const cc_enc_number = ref("")
    const full_name = ref("")
    const expiry = ref("")
    const cvv = ref("")

    // const handle_confirm = () => emit('confirm')

    const cardForm = ref<HTMLFormElement | null>(null)
    const xCardNumRef = ref<HTMLInputElement | null>(null)
    const xCardNum = ref("")

    // Función para generar manualmente el xCardNum
    const handle_confirm = async () => {
        if (window.EncryptedFields && cardForm.value) {
            // Se invoca la función del plugin que genera el xCardNum.
            window.EncryptedFields.generateXCardNum();
            
            // Esperamos a que el DOM se actualice (Vue sincroniza Virtual DOM -> DOM real)
            await nextTick();
            
            // Accedemos al input oculto mediante el ref
            const inputEl = xCardNumRef.value;
            if (inputEl) {
            // Actualizamos la variable reactiva
            xCardNum.value = inputEl.value;
            console.log("xCardNum generated:", xCardNum.value);
            
            // Emitimos el evento de confirmación con el valor generado
            emit('confirm', { 
                xCardNum: xCardNum.value,
                cc_number: cc_number.value,
                full_name: full_name.value,
                expiry: expiry.value,
                cvv: cvv.value 
            });
            }
        }
    }*/ 
    // import { ref } from 'vue'
    // import { useCardEncryption } from '~/composables/useCardEncryption'

    const cc_number = ref('')
    const cc_name = ref('')
    const cvv = ref('')
    const expiry = ref('')
    const encryptedValue = ref('')

    const { encryptCardData } = useCardEncryption()

    function handle_confirm() {
    // Aquí se llama a la función para obtener el valor encriptado
    encryptedValue.value = encryptCardData(cc_number.value, cvv.value)
    // Luego puedes enviar el formulario o realizar otras acciones
    console.log('Valor encriptado:', encryptedValue.value)

    const data_to_send: New_CC = {
        number: Number(cc_number.value),
        cc_name: cc_name.value,
        expiry: expiry.value,
        cvv: Number(cvv.value),
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