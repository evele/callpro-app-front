<template>
    <div>
        <p class="text-title" style="color: green;">Packages page</p>
        <button type="button" class="button is-primary" @click="load_steps">Load steps</button>
    </div>
</template>

<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query'

    const queryClient = useQueryClient()

    const { data: packagesStepsData } = useFetchPackagesSteps()
    const { data: MonthlyGroupsPlansData } = useFetchMonthlyGroupsPlans()

    const load_steps = () => {
        queryClient.invalidateQueries({ queryKey: [PACKAGES_STEPS] });
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>