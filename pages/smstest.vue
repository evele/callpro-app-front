<template>
    <div>
        <p class="text-title">SMS Test page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error.message }}</span>
        <ul v-else>
            <li v-for="tz in settings.timezones" :key="tz.zones_id">{{ tz.display }}</li>
        </ul>
        <button type="button" @click="load_settings">Load settings</button>
    </div>
</template>

<script setup>
    const { data: settings, error, isLoading, isError, refetch } = useFetchSmsTests()
    
    const load_settings = () => {
        refetch()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>