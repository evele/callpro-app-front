<template>
    <div>
        <p class="text-title">Billing page</p>
        <div class="first-section-container">
            <div>
                <button type="button" @click="load_invoices">Load Invoices</button>
                <ul>
                    <li v-for="invoice in billingStore.user_invoices" :key="invoice.id" style="margin: 1rem 0;">
                        {{ invoice.id }}
                        <button type="button">
                            <NuxtLink :to="{ name: 'print_invoice-id', params: { id: invoice.id } }" target=”_blank”>View Invoice</NuxtLink>
                        </button>
                    </li>
                </ul>
            </div>

            <div>
                <button type="button" @click="show_add_card_form">Add New Card</button>
                <p v-if="showSuccess" style="color: green;">Success!</p>
                <p v-if="showError" style="color: red;">Error!</p>

                <form v-show="isAddingCard" id="payment-form" style="margin-top: 1rem;">
                    <label for="card-number">Number</label>
                    <br />
                    <iframe id="test-iframe" data-ifields-id="card-number" data-ifields-placeholder="Card Number" src="https://cdn.cardknox.com/ifields/2.6.2006.0102/ifield.htm"></iframe>
                    <input data-ifields-id="card-number-token" name="xCardNum" type="hidden"></input>
                    <br />

                    <label for="name">Full Name</label>
                    <br />
                    <input id="name" name="name" placeholder="JOHN DOE" type="text" v-model="cardName">
                    <br />

                    <label for="expiry">MMYY</label>
                    <br />
                    <input id="expiry" name="expiry" placeholder="05 / 29" type="text" @input="formatExpiry"></input>
                    <br />
                    
                    <label for="cvv">CVV</label>
                    <br />
                    <iframe data-ifields-id="cvv" data-ifields-placeholder="CVV" src="https://cdn.cardknox.com/ifields/2.6.2006.0102/ifield.htm"></iframe>
                    <input data-ifields-id="cvv-token" name="xCVV" type="hidden"></input>
                    <br />

                    <button id="submit-btn" type="button" @click="confirm_add_card">
                        {{ isSavingCard ? 'Saving...' : 'Save Card' }}
                    </button>
                    <br />
                    <label id="transaction-status"></label>
                    <br />
                    <label data-ifields-id="card-data-error"></label>
                    <br />
                </form>
            </div>
        </div>

        <button type="button" @click="load_cards">Load cards</button>
        <p v-if="isLoading">Loading data...</p>
        <ul v-else>
            <li v-for="card in userCreditCards" :key="card.id" style="margin: 10px 0;">
                {{ 'XXXX XXXX XXXX '+ card.last_four }}
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { useBillingStore, useCreditCardsStore } from "@/stores"
    import { useHead } from '#app';

    useHead({
        script: [
            {
                src: 'https://cdn.cardknox.com/ifields/2.6.2006.0102/ifields.min.js',
                async: true,
                defer: true,
            },
        ],
    });

    const billingStore = useBillingStore()
    const creditCardsStore = useCreditCardsStore()

    const userCreditCards = computed(() => creditCardsStore.credit_cards)
    const isLoading = ref(true)
    const isAddingCard = ref(false)
    const isSavingCard = ref(false)
    const showSuccess = ref(false)
    const showError = ref(false)

    const cardNumber = ref('')
    const cardName = ref('')
    const cardMMYY = ref('')

    const defaultStyle = {
        border: '1px solid black',
        'font-size': '14px',
        padding: '3px',
        width: '350px',
        height: '30px',
        borderRadius: '5px'
    };

    onMounted(async() => {
        Promise.all([
            billingStore.getUserInvoicesData(),
            creditCardsStore.getUserCreditCards()
        ])
        isLoading.value = false
    })

    const formatExpiry = (event) => {
      let input = event.target.value.replace(/\D/g, '');

      if (input.length >= 3) {
        input = input.substring(0, 2) + ' / ' + input.substring(2, 4);
      }

      event.target.value = input;
      cardMMYY.value = input;
    };
    
    const load_invoices = () => {
        billingStore.getUserInvoicesData()
    }

    const load_cards = async () => {
        isLoading.value = true
        await creditCardsStore.getUserCreditCards()
        isLoading.value = false
    }

    const show_add_card_form = () => {
        isAddingCard.value = true
        setIfieldStyle('card-number', defaultStyle);
        setIfieldStyle('cvv', defaultStyle);
        enableAutoFormatting();

        addIfieldCallback('input', function(data) {
            if (data.ifieldValueChanged) {
                console.log(data.cardNumberIsValid);
                console.log(data.cardNumberFormattedLength);
            }
        });
    }

    const confirm_add_card = () => {
        isSavingCard.value = true
        setAccount("ifields_callprodev933101e0b7514aeda1729ac6e43", "callpro-software", "0.1.2")

        // acá se manda la data a la API y vuelve encriptada
        getTokens(async function() {
                // los inputs escondidos se autocompletan con los valores encriptados
                const enc_card_number = document.querySelector("[data-ifields-id='card-number-token']").value;
                const enc_card_cvv = document.querySelector("[data-ifields-id='cvv-token']").value;

                const dataToSend = {
                    cc_number: '',
                    cc_name: cardName.value,
                    expiry: cardMMYY.value,
                    enc_card_number,
                    cvv: '286'
                }

                const res = await creditCardsStore.addUserCreditCard(dataToSend)
                console.log(res)
                isSavingCard.value = false

                // if(res.result) {
                //     isAddingCard.value = false
                //     showSuccess.value = true
                //     setTimeout(() => {
                //         showSuccess.value = false
                //     }, 3000)
                //     reset_form()
                //     load_cards()
                // } else {
                //     showError.value = true
                //     setTimeout(() => {
                //         showError.value = false
                //     }, 3000)
                //     console.log(res)
                // }
            },
            function() {
                // en caso de fallar cae acá
                console.log('falló')
                return
            },
            30000
        );
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
    iframe {
        border: 0 solid black;
        width: 600px;
        height: 45px;
        padding: 0px;
        margin-bottom: 5px;
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

    #card-data-error {
        color: red;
    }

    #submit-btn {
        background-color: #3f143e;
        color: #FFF;
        width: 357px;
        padding: 10px 0;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    #submit-btn:hover {
        background-color: #533752;
        cursor: pointer;
    }

    .results {
        background-color: #e8e8e8;
        padding: 20px;
        width: 360px;
    }
</style>