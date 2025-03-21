<template>
    <div
        ref="tooltipRef"
        class="fixed left-full ml-2 top-1/2 -translate-y-1/2 z-[2000] w-fit text-danger-2 text-xs 
            font-semibold py-2 px-3 rounded-lg bg-danger-light border border-grey-14 shadow-md"
        :style="tooltipStyle"
    >
         <div class="absolute top-[9px] -left-[7px] -translate-y-1/2">
            <div class="absolute -top-[1px] -left-[1px] w-0 h-0 border-b-8 border-t-8 border-r-8 
                        border-b-transparent border-t-transparent border-grey-14">
            </div>
            <div class="absolute top-0 left-0 w-0 h-0 border-b-[7px] border-t-[7px] border-r-[7px] 
                        border-b-transparent border-t-transparent border-danger-light">
            </div>
        </div>

        {{ props.message }}
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        message: string,
        target: string,
    }>();

    const tooltipRef = ref(null);
    const tooltipStyle = computed(() => {
        if (!props.target) return {};
        const target = document.querySelector(`#${props.target}`)
        if (!target) return {};

        const rect = target.getBoundingClientRect();
        return {
            top: `${rect.top + window.scrollY + rect.height / 2}px`,
            left: `${rect.right + window.scrollX + 10}px`,
            transform: "translateY(-50%)",
        };
    });
</script>