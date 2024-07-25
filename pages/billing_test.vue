<template>
    <div>
        <p class="text-title">Billing test page</p>
        <div>
            <button type="button" @click="show_add_card_form">Add New Card</button>
            <p v-if="showSuccess" style="color: green;">Success!</p>
            <p v-if="showError" style="color: red;">Error!</p>
            <br />
            <br />
            <br />

            <form class='js-card-form' data-encryptedfields="encrypted-form">
                <div>
                    <label for="number">Number</label>
                    <input id="number" type="text" placeholder="**** **** **** ****">
                    <input id="enc-number" type="text" data-encryptedfields="cc" placeholder="**** **** **** ****">
                </div>

                <div>
                    <label for="cc-name">Full Name</label>
                    <input id="cc-name" name="checkout-cc-name" type="text" placeholder="JOHN DOE">
                </div>

                <div>
                    <label for="expiry">MMYY</label>
                    <input id="expiry" name="checkout-cc-expiry" type="text" placeholder="0119">
                </div>

                <div>
                    <label for="cvv">CVC</label>
                    <input id="cvv" data-encryptedfields="cvv" type="text" placeholder="***">
                </div>

                <div>
                    <button id='add-card-button' type="button">Add Card</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { useCreditCardsStore } from "@/stores"

    const creditCardsStore = useCreditCardsStore()

    const isLoading = ref(true)
    const isAddingCard = ref(false)
    const isSavingCard = ref(false)
    const showSuccess = ref(false)
    const showError = ref(false)
    const renderKey = ref(0)
    const script_loaded_message = ref('No cargó aún')

    const cardNumber = ref('')
    const cardName = ref('')
    const cardMMYY = ref('')

    // const loadScript = () => {
    //     const script = document.createElement('script');
    //     script.src = "https://cdn.cardknox.com/js/v1/encryptedfields.js";
    //     document.body.appendChild(script);
        
    //     script.onload = () => {
    //         renderKey.value += 1
    //         script_loaded_message.value = 'Script cargado'
    //     }
    // }

    onMounted(() => {
        console.log('ready')
        // loadScript()
    })

    const formatExpiry = (event) => {
      let input = event.target.value.replace(/\D/g, '');

      if (input.length >= 3) {
        input = input.substring(0, 2) + ' / ' + input.substring(2, 4);
      }

      event.target.value = input;
      cardMMYY.value = input;
    };

    const show_add_card_form = () => {
        isAddingCard.value = true
    }

    const confirm_add_card = () => {
        const dataToSend = {
            cc_number: '',
            cc_name: cardName.value,
            expiry: cardMMYY.value,
            enc_card_number,
            cvv: '286'
        }
        console.log(dataToSend)
    }
    const reset_form = () => {
        cardNumber.value = ''
        cardName.value = ''
        cardMMYY.value = ''
        cardCVC.value = ''
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .first-section-container {
        display: flex;
        gap: 4rem;
    }
    .add-card-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    input {
        border: 1px solid black;
        border-radius: 5px;
        font-size: 14px;
        padding: 3px;
        width: 350px;
        height: 30px;
        margin-bottom: 15px;
    }

    #add-card-button {
        background-color: #3f143e;
        color: #FFF;
        width: 357px;
        padding: 10px 0;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    #add-card-button:hover {
        background-color: #533752;
        cursor: pointer;
    }
</style>