<template>
    <div>
        <p class="text-title">Packages page</p>
        <button type="button" @click="load_steps">Load steps</button>
    </div>
</template>

<script setup>
    import { usePackagesStore } from "@/stores"

    const packagesStore = usePackagesStore()

    onMounted(async() => {
        await packagesStore.getPackagesSteps()
        await packagesStore.getMonthlyGroupsPlans()
    })
    
    const load_settings = () => {
        packagesStore.getPackagesSteps()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>