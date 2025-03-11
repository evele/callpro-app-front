<template>
    <Button 
        type="button" 
        :class="[`w-6 h-6 rounded-[10px] p-0 text-dark-3 border-none hover:scale-110 transition-transform`, props.bgColor, props.styles]"
    >
        <slot name="icon" />
    </Button>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        bgColor?: string
        styles?: string
    }>(), {
        bgColor: 'bg-grey-10',
        styles: ''
    })
</script>