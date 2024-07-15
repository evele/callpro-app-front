<template>
    <div>
        <p class="text-title">Call in codes page</p>
        <button type="button" @click="load_numbers">Load data</button>
    </div>
</template>

<script setup>
    import { useCallInCodesStore } from "@/stores"

    const callInCodesStore = useCallInCodesStore()

    onMounted(async() => {
        await callInCodesStore.loadUserCallInCodes()
    })
    
    const load_numbers = () => {
        callInCodesStore.loadUserCallInCodes()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>