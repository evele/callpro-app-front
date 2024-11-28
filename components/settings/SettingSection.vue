<template>
    <section class="flex w-full gap-20 p-3">
        <div class="min-w-48 w-[25%]">
            <h3 class="text-[#4F378B] text-xl font-bold mb-2">{{ title }}</h3>
            <p class="text-[#757575]">{{ description}}</p>
        </div>

        <div class="flex-grow"><slot /></div>
    </section>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: {  type: String, required: true, default: '' },
        description: { type: String, required: true, default: '' }
    })
</script>