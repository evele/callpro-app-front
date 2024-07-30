<template>
    <div>
        <p class="text-title">Caller Ids page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error.message }}</span>
        <button type="button" @click="load_numbers">Load numbers</button>
        <ul v-if="isSuccess">
            <li v-for="number in data.caller_ids" :key="number">
                {{ number.caller_id }}
            </li>
        </ul>
    </div>
</template>

<script setup>
    const { data, error, isSuccess, isLoading, isError, refetch } = useFetchCallerID()
    
    const load_numbers = () => {
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