<template>
    <div class="bg-white rounded-2xl w-full min-h-[700px] shadow-lg p-6">
        <div class="flex items-center gap-4">
            <Button type="button" class="text-dark-3 bg-transparent rounded-full p-0 w-6 h-6 shadow-md border-grey-14 hover:bg-gray-200" @click="emit('update:sectionToShow', 'main')">
                <ArrowLeftSVG class="w-[7px] h-[7px]" />
            </Button>
            <h4 class="text-dark-3 text-lg font-semibold">{{ title_text }}</h4>
            <div v-show="props.selectedType === 'credit'" class="flex-grow"></div>
            <AutoRecharge v-if="props.selectedType === 'credit'" :user-billing-settings="props.userBillingSettings" :packages-steps="packages_steps" />
        </div>

        <div class="flex flex-col justify-between h-full pb-8">
            <section v-if="props.selectedType === 'credit'" class="mt-8 flex flex-wrap gap-4">
                <Skeleton v-if="isLoadingPS" v-for="(_, index) in array_of_ten" :key="index" class="rounded-2xl" height="196px" width="188px"></Skeleton>
                <CreditCard v-for="step in packages_steps" :key="step.id" :step="step" />
            </section>

            <section v-else class="mt-8 flex flex-wrap gap-4">
                <Skeleton v-if="isLoadingMGP" v-for="(_, index) in array_of_ten" :key="index" class="rounded-2xl" height="196px" width="146px"></Skeleton>
                <PlanCard v-for="plan in monthly_groups_plans" :key="plan.id" :plan="plan" @click="handle_select_plan(plan)"  />
            </section>

            <InsertCreditsManually v-if="props.selectedType === 'credit'" :packages-steps="packages_steps" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const { data: PS_Data, isLoading: isLoadingPS } = useFetchPackagesSteps()
    const { data: MGP_Data, isLoading: isLoadingMGP } = useFetchMonthlyGroupsPlans()

    const props = defineProps<{
        selectedType: SelectedBillingType,
        userBillingSettings: UserBillingSettingsData | null
    }>()

    const emit = defineEmits<{
        (event: 'update:sectionToShow', value: BillingSectionToShow): void
    }>()

    const billingStore = useBillingStore()

    const title_text = computed(() => props.selectedType === 'credit' ? 'Buy credits' : 'Unlimited Monthly Plans')

    const array_of_ten = ref(Array.from({ length: 10 }))

    const packages_steps = computed(() => {
        if(!PS_Data?.value?.result) return []
        return PS_Data.value.steps
    })

    const monthly_groups_plans = computed(() => {
        if(!MGP_Data?.value?.result) return []
        return [...MGP_Data.value.monthly_groups_plans].sort((a, b) => Number(a.price) - Number(b.price))
    })

    const handle_select_plan = (plan: MonthlyGroupPlan) => {
        billingStore.setReferenceStepId(null)
        billingStore.selectUnselectPlan(plan)
        const selected_plan = billingStore.selected_plan
        if(selected_plan) {
            const pack_info = Number(selected_plan.price) || 0
            const discount = 0
            const subtotal = pack_info
            const total = subtotal
            const recap_data = { pack_info, discount, subtotal, total }
            billingStore.setRecapData(recap_data)
        } else {
            billingStore.setRecapData(null)
        }
    }
</script>