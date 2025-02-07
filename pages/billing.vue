<template>
    <section class="bg-white py-2 pl-8 flex gap-3 items-center flex-wrap">
        <h2 class="text-2xl font-semibold">Plans and Billing</h2>
    </section>

    <div v-if="section_to_show === 'main'" class="p-6 mb-10">
        <CardsSection />
    </div>

    <div v-if="section_to_show === 'buy_credits'" class="p-6 mb-10 flex gap-4">
        <div class="bg-white rounded-2xl w-full h-[750px] shadow-lg"></div>
        <ContainerRight />
    </div>
</template>

<script setup lang="ts">
    type SectionToShow = 'main' | 'buy_credits'
    const section_to_show = ref('buy_credits')
</script>