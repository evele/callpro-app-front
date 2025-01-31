<template>
    <div>
        <button type="button" @click="console.log(formatted_invoices_data)">
            Click me
        </button>
    </div>
</template>

<script setup lang="ts">
     const props = defineProps<{
        invoicesData: Invoice[],
        isLoading: boolean
    }>()

    const formatted_invoices_data = computed(() => {
        return [...props.invoicesData].reverse()
    })
</script>

<style scoped>

</style>