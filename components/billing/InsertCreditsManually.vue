<template>
    <div class="h-[214px] w-full flex flex-col py-4 px-6 bg-card bg-cover bg-center rounded-xl">
        <div class="bg-white rounded-lg border-2 border-grey-main h-[30px] w-32 flex items-center justify-center">
            <p class="text-dark-3 font-semibold">$ {{ price?.toFixed(2) }}</p>
        </div>

        <div class="w-[180px] h-[52px] rounded-lg border-2 border-grey-main bg-white mx-auto mt-9 flex items-center overflow-hidden">
            <div class="w-11 flex justify-end">
                <CoinSVG class="w-7 h-7" />
            </div>
            <InputNumber 
                v-model="manual_credits" 
                inputId="integeronly" 
                fluid
                placeholder="0"
                class="w-[130px] h-[48px] placeholder:text-grey-7 font-semibold text-[28px] border-none rounded-1"
                @input="handle_manual_credits"
                @focus="is_focusing = true"
                @blur="is_focusing = false"
            />
        </div>
        <p class="text-black text-sm font-medium text-center mt-2">Insert credits manually</p>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        packagesSteps: PackageStepWithID[]
    }>()

    const price = ref<number | null>(null)
    const manual_credits = ref<number | null>(null)
    const is_focusing = ref<boolean>(false)

    const billingStore = useBillingStore()

    watch(() => billingStore.selected_step, (step: FormattedStep | null) => {
        if(step) {
            price.value = Number(step.Total)
            manual_credits.value = Number(step.floor)
        } else {
            if(!billingStore.reference_step_id && !is_focusing.value) {
                price.value = null
                manual_credits.value = null
            }
        }
    })

    const handle_manual_credits = (e: any) => {
        const value = e.value
        if(value === null || !props.packagesSteps?.length) {
            price.value = null
            billingStore.setReferenceStepId(null)
            return
        }

        const filtered_steps = props.packagesSteps.filter((step: PackageStepWithID) => Number(step.floor) <= value)

        const right_step: PackageStepWithID | undefined = filtered_steps.reduce((highest: PackageStepWithID, step: PackageStepWithID) => {
            return Number(step.floor) > Number(highest.floor) ? step : highest;
        }, filtered_steps[0]);

        if(right_step) {
            price.value = Number((value * parseFloat(right_step.price)))

            const with_discount = right_step.price != right_step.regular_price
            const pack_info = value * Number(right_step.regular_price)
            const discount = with_discount ? Number(pack_info) - price.value : 0
            const recap_data = {
                pack_info,
                discount,
                subtotal: Number(pack_info) - Number(discount),
                total: Number(pack_info) - Number(discount)
            }

            billingStore.setReferenceStepId(right_step.id)
            billingStore.setRecapData(recap_data) 
        } else {
            price.value = null
            billingStore.setReferenceStepId(null)
            billingStore.selectUnselectStep(null)
            billingStore.setRecapData(null)
        }
    }
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