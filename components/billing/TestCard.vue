<template>
    <div class="bg-white p-6 rounded-2xl shadow-md mt-4 px-16">
        <Paycard :value-fields="valueFields" @get-type="changeType" :isCardNumberMasked="isCardNumberMasked" :current-focus="currentFocus" />
        
        <form class="flex flex-col gap-6 mt-10 mx-16">
            <div class="flex gap-10 items-center">
                <div class="flex flex-col items-start gap-2 w-full">
                    <label for="lastName" class="text-dark-3">Card Holders</label>
                    <InputText 
                        :id="inputFields.cardName"
                        v-model="valueFields.cardName"
                        class="w-full py-3 border h-10 placeholder-grey-7"
                        placeholder="Card Name"
                        data-card-field
                    />
                </div>

                <div class="flex flex-col items-start gap-2 w-full">
                    <label for="cardNumber" class="text-dark-3">Card Number</label>
                    <InputText 
                        :id="inputFields.cardNumber"
                        :value="valueFields.cardNumber"
                        @input="changeNumber"
                        class="w-full py-3 border h-10 placeholder-grey-7"
                        placeholder="Card Number"
                        title="Number"
                        data-card-field
                        :maxlength="cardNumberMaxLength"
                    />
                </div>
            </div>

            <div class="flex gap-10 items-center">
                <div class="flex flex-col items-start gap-2 w-1/3">
                    <label for="lastName" class="text-dark-3">Expiration Date</label>
                    <Select 
                        :id="inputFields.cardMonth" 
                        v-model="valueFields.cardMonth" 
                        :options="monthsOptions" 
                        placeholder="Card Month"
                        class="w-full border border-grey-8"
                        data-card-field
                        @focus="changeFocus(inputFields.cardMonth)"
                    ></Select>
                </div>
            
                <Select 
                    :id="inputFields.cardYear" 
                    v-model="valueFields.cardYear" 
                    :options="yearsOptions" 
                    placeholder="Card Year"
                    class="w-1/3 border border-grey-8 self-end"
                    data-card-field 
                    @focus="changeFocus(inputFields.cardYear)"
                ></Select>
            
                <div class="flex flex-col items-start gap-2 w-1/3">
                    <label for="lastName" class="text-dark-3">CVV</label>
                    <InputText 
                        :value="valueFields.cardCvv" 
                        :id="inputFields.cardCvv"
                        class="w-full py-3 border h-10 placeholder-grey-7"
                        placeholder="Card CVV"
                        data-card-field
                        @input="changeCvv"   
                    />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
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

const currentFocus = ref<string | null>('v-card-month')

const changeType = (type: CardType) => {
    console.log(type)
}

const changeCvv = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, '');
    if(target.value.length > 4) {
        target.value = target.value.slice(0, 4)
    }
    valueFields.cardCvv = target.value
}

const changeFocus = (field: string) => {
    currentFocus.value = field
    console.log(currentFocus.value)
}

const maxLengthAmex = 17
const maxLengthDiners = 16
const maxLengthOthers = 19

const minCardYear = new Date().getFullYear()
const cardNumberMaxLength = ref(maxLengthOthers)
const isCardNumberMasked = ref(false)

const minCardMonth = computed(() => {
    if (valueFields.cardYear === minCardYear.toString()) {
        return new Date().getMonth() + 1
    }
    return 1
})

watch(() => valueFields.cardMonth, (newVal: string) => {
    if (Number(newVal) < minCardMonth.value) {
        valueFields.cardMonth = ''
    }
})

const changeNumber = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, '');
    valueFields.cardNumber = target.value

    const cardPatterns: Record<CardType, RegExp> = {
        [CardType.VISA]: /^4/,
        [CardType.MASTERCARD]: /^5[1-5]|^22[2-9]|^2[3-7]/,
        [CardType.AMERICAN_EXPRESS]: /^3[47]/,
        [CardType.DISCOVER]: /^6011|^64[4-9]|^65/,
        [CardType.JCB]: /^35/,
        [CardType.DINERS_CLUB]: /^3(0[0-5]|[68])/,
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

    if (e.inputType == 'deleteContentBackward') {
        const lastChar = valueFields.cardNumber.substring(valueFields.cardNumber.length, valueFields.cardNumber.length - 1)
        if (lastChar == ' ') { valueFields.cardNumber = valueFields.cardNumber.substring(0, valueFields.cardNumber.length - 1) }
      }
}

const generateMonths = (n: number) => {
    return n < 10 ? `0${n}` : `${n}`
}

const yearsOptions = Array.from({ length: 10 }, (_, i) => `${minCardYear + i}`)
const monthsOptions = computed(() => {
    const months = Array.from({ length: 12 }, (_, i) => generateMonths(i + 1))
    if (valueFields.cardYear === minCardYear.toString()) {
        return months.slice(minCardMonth.value - 1)
    }
    return months
})
</script>