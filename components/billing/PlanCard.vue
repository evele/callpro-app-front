<template>
    <CardOptionContainer type="plan">
        <template #chip-icon>
            <div class="w-fit h-[30px] rounded-lg bg-white border flex items-center gap-2 px-1 border-primary">
                <UserSVG class="w-4 h-4 text-primary" />
                <span class="text-dark-3 font-semibold leading-0 mt-[1px]">{{ props.plan.numbers }}</span>
            </div>
        </template>

        <template #card-content>
            <div class="flex flex-col gap-1">
                <p class="text-3xl font-semibold">{{ format_price(Number(props.plan.price), 0) }}</p>

                <Divider class="bg-dark-4 h-[3px] rounded-full" />

                <p class="text-xs text-dark-4 h-4 font-medium">62% discount</p>
            </div>
        </template>
    </CardOptionContainer>
</template>
<script setup lang="ts">

const props = defineProps<{
    plan: MonthlyGroupPlan
}>()

</script>