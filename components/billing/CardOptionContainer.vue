<template>
    <div class="h-[196px] flex flex-col justify-between rounded-xl p-3 pb-5" :class="type">
        <slot name="chip-icon" />
        <slot name="card-content" />
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        type: SelectedBillingType
    }>()
</script>

<style scoped lang="scss">
    .credit {
        border: 0.3px solid #CAC4D0;
        background: radial-gradient(397.76% 355.04% at -223.94% 227.3%, #1F102E 0%, #653494 48%, #1F102E 100%);
        width: 188px; /* TODO: maybe we will handle the width from a grid container */
        color: #FFF;
    }
    .plan {
        border: 0.3px solid rgba(101, 52, 148, 0.60);
        background: radial-gradient(273.33% 318.02% at -68.84% -32.65%, #9747FF 0%, #F7F2FA 50.75%, #F7F2FA 100%);
        width: 146px;
    }
</style>