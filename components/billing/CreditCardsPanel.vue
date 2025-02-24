<template>
    <div class="flex flex-col gap-6 max-h-[600px] overflow-y-auto">
        <ShowCreditCard 
            v-for="card in props.userCardsData" 
            :credit-card="card"
            :key="card.id" 
            :is-selected="selected_card?.id === card.id"
            @click="handle_card_selection(card)"
        />

        <Button class="bg-white text-dark-3 border border-dashed border-[#9E9AA0] font-semibold min-h-[122px] rounded-md text-lg hover:bg-gray-200">
            <PlusRoundedSVG class="w-10 h-10 mr-4" />
            Add new card
        </Button>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        userCardsData: CC_CARD[]
        isLoading: boolean
    }>()

    const emit = defineEmits(['selected-card'])

    const selected_card = ref<CC_CARD | null>(null)

    const handle_card_selection = (card: CC_CARD) => {
        selected_card.value = card
        emit('selected-card', card)
    }
</script>