<template>
    <div
        ref="tooltipRef"
        class="fixed left-full ml-2 top-1/2 -translate-y-1/2 z-[10000] w-fit text-danger-2 text-xs 
            font-semibold py-2 px-3 rounded-lg bg-danger-light border border-grey-14 shadow-md"
        :style="tooltipStyle"
    >
        {{ props.message }}
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
    message: String,
    target: Object,
});

const tooltipRef = ref(null);
const tooltipStyle = computed(() => {
    if (!props.target) return {};

    const rect = props.target.getBoundingClientRect();
    return {
        top: `${rect.top + window.scrollY + rect.height / 2}px`,
        left: `${rect.right + window.scrollX + 10}px`,
        transform: "translateY(-50%)",
    };
});
</script>