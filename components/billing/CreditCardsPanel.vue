<template>
    <div :key="temp_key" class="flex flex-col gap-6 max-h-[600px] overflow-y-auto overflow-x-hidden pb-2">
        <ShowCreditCard 
            v-for="card in props.userCardsData" 
            :credit-card="card"
            :key="card.id" 
            :is-selected="props.selectedCard?.id === card.id"
            @click="emit('update:selected-card', card)"
        />

        <Button class="bg-white text-dark-3 border border-dashed border-[#9E9AA0] font-semibold min-h-[122px] rounded-md text-lg hover:bg-gray-200">
            <PlusRoundedSVG class="w-10 h-10 mr-4" />
            Add new card
        </Button>

        <Button
            type="button" 
            class="mt-4 text-purple-main bg-transparent border-none text-sm font-medium w-fit self-end hover:scale-110 transition-transform"
            @click="emit('hide-cards', false, TAB_BILLING)"
        >
            <ArrowLeftSVG class="w-3 h-3" />
            Go to main
        </Button>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        userCardsData: CC_CARD[]
        isLoading: boolean
        selectedCard: CC_CARD | null
    }>()

    // force re-render the component when the userCardsData changes, to show the default card updated
    const temp_key = ref(0)
    watch(() => props.userCardsData, () => temp_key.value++, { deep: true })

    const emit = defineEmits<{
        (event: 'update:selected-card', value: CC_CARD): void
        (event: 'hide-cards', value: boolean, tab: string): void
    }>()
</script>