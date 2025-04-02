<template>
    <Button 
        class="rounded-md shadow-lg disabled:bg-white"
        :class="[props.grayBg ? 'bg-light-1 hover:bg-white' : 'bg-white hover:bg-gray-200', 
            props.redText ? 'text-danger-2 border-danger-2' : 'text-grey-main border-grey-main' 
        ]"
        :disabled="props.isDisabled"
    >
        <ProgressSpinner v-if="props.isLoading" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" :aria-label="props.ariaText" />
        <slot v-else name="icon"></slot>
        <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ props.isLoading ? props.loadingText : props.btnText }}</span>
    </Button>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        isDisabled?: boolean
        isLoading?: boolean,
        ariaText?: string,
        btnText: string,
        loadingText?: string
        grayBg?: boolean,
        redText?: boolean
    }>(), {
        isDisabled: false,
        isLoading: false,
        ariaText: '',
        loadingText: '',
        grayBg: false,
        redText: false
    })
</script>