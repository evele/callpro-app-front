<template>
    <div class="bg-white p-6 rounded-2xl shadow-md mt-4 px-16">
        <Paycard :value-fields="valueFields" :hasRandomBackgrounds="false" @get-type="changeType" :isCardNumberMasked="isCardNumberMasked" />
        
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
                    ></Select>
                </div>
            
                <Select 
                    :id="inputFields.cardYear" 
                    v-model="valueFields.cardYear" 
                    :options="yearsOptions" 
                    placeholder="Card Year"
                    class="w-1/3 border border-grey-8 self-end"
                    data-card-field 
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

const changeType = (type) => {
    console.log(type)
}

const changeCvv = (e) => {
  valueFields.cardCvv = e.target.value
}

const minCardYear = new Date().getFullYear()
const mainCardNumber = ref('')
const cardNumberMaxLength = ref(19)
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

const changeNumber = (e) => {
    console.log(e)
    valueFields.cardNumber = e.target.value
    const value = valueFields.cardNumber.replace(/\D/g, '')
    // american express, 15 digits
    if ((/^3[47]\d{0,13}$/).test(value)) {
        valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        cardNumberMaxLength.value = 17
    } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
        valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        cardNumberMaxLength.value = 16
    } else if (/^62[0-9]\d*/.test(value)) {
        valueFields.cardNumber = value.replace(/(\d{6})/, '$1 ').replace(/(\d{6}) (\d{7})/, '$1 $2 ').replace(/(\d{6}) (\d{7}) (\d{6})/, '$1 $2 $3 ').replace(/(\d{5}) (\d{5}) (\d{5}) (\d{4})/, '$1 $2 $3 $4')
        cardNumberMaxLength.value = 21
    } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
        valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        cardNumberMaxLength.value = 19
    }
    // if (e.inputType == 'deleteContentBackward') {
    //     const lastChar = valueFields.cardNumber.substring(valueFields.cardNumber.length, valueFields.cardNumber.length - 1)
    //     if (lastChar == ' ') { valueFields.cardNumber = valueFields.cardNumber.substring(0, valueFields.cardNumber.length - 1) }
    // }
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

const toggleMask = () => {
    isCardNumberMasked.value = !isCardNumberMasked.value

    if (isCardNumberMasked.value) {
    maskCardNumber()
    } else {
    unMaskCardNumber()
    }
}

const maskCardNumber = () => {
    mainCardNumber.value = valueFields.cardNumber
    const arr = valueFields.cardNumber.split('')
    arr.forEach((element, index) => {
    if (index > 4 && index < 14 && element.trim() !== '') {
        arr[index] = '*'
    }
    })
    valueFields.cardNumber = arr.join('')
}

const unMaskCardNumber = () => {
    valueFields.cardNumber = mainCardNumber.value
}
</script>