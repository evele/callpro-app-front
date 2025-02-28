<template>
    <div class="h-[214px] w-full flex flex-col py-4 px-6 bg-card bg-cover bg-center rounded-xl">
        <div class="bg-white rounded-lg border-2 border-grey-main h-[30px] w-32 flex items-center justify-center">
            <p class="text-dark-3 font-semibold">$ {{ price }}</p>
        </div>

        <div class="w-[180px] h-[52px] rounded-lg border-2 border-grey-main bg-white mx-auto mt-7 flex items-center overflow-hidden">
            <div class="w-11 flex justify-end">
                <CoinSVG class="w-7 h-7" />
            </div>
            <InputNumber 
                v-model="manual_credits" 
                inputId="integeronly" 
                fluid
                placeholder="0"
                class="w-[130px] h-[48px] placeholder:text-grey-7 font-semibold text-[28px] border-none rounded-1" 
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    const price = ref<number | null>(null)
    const manual_credits = ref<number | null>(null)

    const billingStore = useBillingStore()

    watch(() => billingStore.selected_step, (step: FormattedStep) => {
        if(step) {
            price.value = Number(step.Total)
            manual_credits.value = Number(step.floor)
        } else {
            price.value = null
            manual_credits.value = null
        }
    })
</script>

<style scoped lang="scss">
.bg-card {
    background-image: url('@/assets/png/credits-manually-bg.png');
    box-shadow: 0px 0px 8px rgba(155, 155, 155, 0.5);
}

:deep(.p-inputnumber) {
    .p-inputtext {
        border: none;
        border-radius: 4px;
        font-size: 28px;
        width: 130px;
    }
}
</style>