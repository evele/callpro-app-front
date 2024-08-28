<template>
    <div>
        <p class="text-title">Did Numbers page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error?.message }}</span>
        <button type="button" class="button is-primary" @click="load_numbers">Load numbers</button>
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