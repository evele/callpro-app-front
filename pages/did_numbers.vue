<template>
    <div>
        <p class="text-title">Did Numbers page</p>
        <button type="button" @click="load_numbers">Load numbers</button>
    </div>
</template>

<script setup>
    import { useDidNumbersStore } from "@/stores"

    const didNumbersStore = useDidNumbersStore()

    onMounted(async() => {
        await didNumbersStore.getDidAndTollFreeNumbers()
    })
    
    const load_numbers = () => {
        didNumbersStore.getDidAndTollFreeNumbers()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>