<template>
    <Button @mouseenter="is_hovering = true" @mouseleave="is_hovering = false"
        class="rounded-xl min-h-12 h-12 bg-white border-[#CAC4D0] hover:bg-[#6750A4] w-full h-full flex justify-start items-center gap-3 px-4 py-2 hover:justify-center"
    >   
        <div v-if="is_hovering" class="bg-white rounded-full p-1 absolute shadow-lg hover:scale-125 transition-transform">
            <PlusSVG class="text-[#6750A4] w-3 h-3"/>
        </div>  
        <component v-if="!is_hovering" :is="icon" :style="{ color: iconColor }" class="w-[30px] h-[30px]"/>
        <div class="flex justify-between w-full">
            <span v-if="!is_hovering" class="text-black text-sm font-semibold leading-none">{{ text }}</span>
            <span v-if="count !== null && !is_hovering" class="text-sm font-medium text-grey-4 leading-none">{{ count || '0' }}</span>
            <Skeleton v-if="count === null" size="1.6rem"></Skeleton>
        </div>
    </Button>
</template>

<script setup lang="ts">
    import PlusSVG from "@/components/svgs/PlusSVG.vue"

    const props = defineProps({
        text: { type: String, required: true },
        count: { type: [Number, null], required: false, default: undefined },
        icon: { type: Object, required: true },
        iconColor: { type: String, required: true }
    });

    const is_hovering = ref(false);
</script>