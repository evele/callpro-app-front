<template>
    <div>
        <p class="text-title">Caller Ids page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error?.message }}</span>
        <Button label="Reload numbers" icon="pi pi-refresh" class="button is-info" @click="load_numbers" />
        <ul v-if="isSuccess && data && 'caller_ids' in data">
            <li v-if="data?.result" v-for="number in data?.caller_ids" :key="number?.id">
                {{ number.caller_id }}
            </li>
            <span v-else-if="isError">Error: {{ error?.message }}</span>                       
        </ul>
    </div>
</template>

<script setup lang="ts">
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