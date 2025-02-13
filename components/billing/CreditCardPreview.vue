<template>
    <div class="bg-gradient-to-br from-[#383838] to-[#9E9E9E] p-10">
        <div class="bg-[#f4f4f4] rounded-[20px] p-8 flex items-end h-[220px] w-full max-w-[340px] mx-auto">
            <div class="flex flex-col gap-2">
                <p class="font-bold text-black text-lg">{{ selected_card.number }}</p>
                <div class="flex items-center gap-8 text-black font-medium text-sm">
                    <p>{{ selected_card.cc_name }}</p>
                    <p>{{ selected_card.expiry }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    // TODO: Work here when tkt 1240 is merged
    const props = defineProps<{
        card: any
    }>()

    const empty_card = {
        cc_name: 'JOHN DOE',
        number: 'XXXX XXXX XXXX XXXX',
        expiry: '00/00',
    }

    // const selected_card = computed(() => props.card ?? empty_card)
    const selected_card = computed(() => empty_card)
</script>