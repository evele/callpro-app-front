<template>
    <div>
        <p class="text-title">Packages page</p>
        <button type="button" @click="load_steps">Load steps</button>
    </div>
</template>

<script setup>
    import { useQueryClient } from '@tanstack/vue-query'

    const queryClient = useQueryClient()

    const { data: packagesStepsData } = useFetchPackagesSteps()
    const { data: MonthlyGroupsPlansData } = useFetchMonthlyGroupsPlans()

    const load_steps = () => {
        queryClient.invalidateQueries([PACKAGES_STEPS]);
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>