<template>
    <div class="bg-white rounded-2xl w-full h-[750px] shadow-lg p-6">
        <h4 class="text-dark-3 text-lg font-semibold">{{ title_text }}</h4>

        <section class="mt-8">
            <CreditCard v-if="props.selected_type === 'credit'" />
            <PlanCard v-else />
        </section>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        selected_type: SelectedBillingType
    }>()

    const title_text = computed(() => props.selected_type === 'credit' ? 'Buy credits' : 'Unlimited Monthly Plans')
</script>