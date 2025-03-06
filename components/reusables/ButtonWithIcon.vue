<template>
    <Button class="rounded-md bg-white border-grey-main shadow-lg text-grey-main hover:bg-gray-200 disabled:bg-white" :disabled="props.isDisabled">
        <ProgressSpinner v-if="props.isLoading" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" :aria-label="props.ariaText" />
        <slot v-else name="icon"></slot>
        <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ props.isLoading ? props.loadingText : props.btnText }}</span>
    </Button>
</template>

<script setup lang="ts">
    const props = defineProps<{
        isDisabled: boolean
        isLoading: boolean,
        ariaText: string,
        btnText: string,
        loadingText: string
    }>()
</script>