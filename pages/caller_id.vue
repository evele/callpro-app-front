<template>
    <div>
        <p class="text-title">Caller Ids page</p>
        <button type="button" @click="load_numbers">Load numbers</button>
    </div>
</template>

<script setup>
    import { useCallerIdStore } from "@/stores"

    const callerIdStore = useCallerIdStore()

    onMounted(async() => {
        await callerIdStore.loadCallerIds()
    })
    
    const load_numbers = () => {
        callerIdStore.loadCallerIds()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>