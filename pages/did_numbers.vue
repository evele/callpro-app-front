<template>
    <div>
        <p class="text-title">Did Numbers page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error?.message }}</span>
        <button type="button" class="button is-primary" @click="load_numbers">Load numbers</button>
        <ul v-if="isSuccess">            
            <li v-if="data?.result" v-for="d_number in data?.did_numbers" :key="d_number?.id">
                <span>Number:</span><span>{{ d_number?.number }}</span>
                <span>ID:</span><span>{{ d_number?.id }}</span>
            </li>
            <li v-if="data?.result" v-for="t_number in data?.toll_free_numbers" :key="t_number?.id">
                <span>Toll-Free Number:</span><span>{{ t_number?.number }}</span>
                <span>ID:</span><span>{{ t_number?.id }}</span>
            </li>
            // TODO: es para probar el error 
            <span v-if="!data?.result && data?.error">Error: {{ data?.error }}</span>
        </ul>
    </div>
</template>

<script setup lang="ts">
    const { data, error, isLoading, isError, isSuccess, refetch } = useFetchDidAndTollFreeNumbers()

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