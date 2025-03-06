<template>
    <CardOptionContainer type="plan" :is-selected="is_selected">
        <template #chip-icon>
            <div class="w-20 h-[30px] rounded-lg bg-white border flex items-center justify-center gap-2 px-1 border-primary">
                <UserSVG class="w-4 h-4 text-primary" />
                <span class="text-dark-3 font-semibold leading-0 mt-[1px]">{{ props.plan.numbers }}</span>
            </div>
        </template>

        <template #card-content>
            <div class="flex flex-col gap-1">
                <p class="text-3xl font-semibold" :class="{ 'text-selected': is_selected }">{{ format_price(Number(props.plan.price), 0) }}</p>

                <Divider class="bg-dark-4 h-[3px] rounded-full" />

                <p class="text-xs text-dark-4 h-4 font-medium" :class="{ 'text-selected': is_selected }">62% discount</p>
            </div>
        </template>
    </CardOptionContainer>
</template>
<script setup lang="ts">

const props = defineProps<{
    plan: MonthlyGroupPlan
}>()

const billingStore = useBillingStore()

const is_selected = computed(() => billingStore.selected_plan?.id === props.plan.id)

</script>

<style scoped lang="scss">
.text-selected {
    background: linear-gradient(180deg, #9747FF 0%, #532CB5 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>