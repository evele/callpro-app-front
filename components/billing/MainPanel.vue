<template>
    <div class="bg-white rounded-2xl w-full min-h-[700px] shadow-lg p-6">
        <h4 class="text-dark-3 text-lg font-semibold">{{ title_text }}</h4>

        <section v-if="props.selected_type === 'credit'" class="mt-8 flex flex-wrap gap-4">
            <Skeleton v-if="isLoadingPS" v-for="(_, index) in array_of_ten" :key="index" class="rounded-2xl" height="196px" width="188px"></Skeleton>
            <CreditCard v-for="(step, index) in packages_steps" :key="index" :step="step"  />
        </section>

        <section v-else class="mt-8 flex flex-wrap gap-4">
            <Skeleton v-if="isLoadingMGP" v-for="(_, index) in array_of_ten" :key="index" class="rounded-2xl" height="196px" width="146px"></Skeleton>
            <PlanCard v-for="plan in monthly_groups_plans" :key="plan.id" :plan="plan"  />
        </section>
    </div>
</template>

<script setup lang="ts">
    const { data: PS_Data, isLoading: isLoadingPS } = useFetchPackagesSteps()
    const { data: MGP_Data, isLoading: isLoadingMGP } = useFetchMonthlyGroupsPlans()

    const props = defineProps<{
        selected_type: SelectedBillingType
    }>()

    const title_text = computed(() => props.selected_type === 'credit' ? 'Buy credits' : 'Unlimited Monthly Plans')

    const array_of_ten = ref(Array.from({ length: 10 }))

    const packages_steps = computed(() => {
        if(!PS_Data?.value?.result) return []
        return PS_Data.value.steps
    })

    const monthly_groups_plans = computed(() => {
        if(!MGP_Data?.value?.result) return []
        return MGP_Data.value.monthly_groups_plans
    })
</script>