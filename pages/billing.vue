<template>
    <section class="bg-white py-2 pl-8 flex gap-3 items-center flex-wrap">
        <h2 class="text-2xl font-semibold">Plans and Billing</h2>
    </section>

    <div class="p-6 mb-10">
        <CardsSection />
    </div>
</template>

<script setup lang="ts">
    const show_credits = ref(true)
</script>