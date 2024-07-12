<template>
    <div>
        <p class="text-title">Settings page</p>
        <button type="button" @click="load_settings">Load settings</button>
    </div>
</template>

<script setup>
    import { useSettingsStore } from "@/stores"

    const settingsStore = useSettingsStore()

    onMounted(async() => {
        await settingsStore.loadSettingsData()
    })
    
    const load_settings = () => {
        settingsStore.loadSettingsData()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>