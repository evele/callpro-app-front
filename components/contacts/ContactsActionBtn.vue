<template>
    <Button @mouseenter="is_hovering = true" @mouseleave="is_hovering = false" @click="handle_btn_action(text)"
        class="rounded-xl min-h-16 h-16 bg-white border-[#CAC4D0] hover:bg-[#6750A4] w-full h-full flex flex-col items-start justify-center pt-3 px-3 relative -space-y-2 hover:items-center hover:pt-2"
    >
        <div v-if="is_hovering" class="bg-white rounded-full p-2 absolute shadow-lg hover:scale-125 transition-transform">
            <PlusSVG class="text-[#6750A4] w-5 h-5"/>
        </div>

        <span v-if="!is_hovering" class="text-[#79747E] text-[10px] leading-none">{{ text }}</span>
        <Skeleton v-if="count === null" size="1.6rem"></Skeleton>
        <span v-if="count && !is_hovering" class="text-3xl font-semibold text-black leading-none">{{ count }}</span>
        <component v-if="!is_hovering" :is="icon" :style="{ color: iconColor }" class="absolute right-1 top-[18px] w-[72px] h-[72px]"/>
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

    const emit = defineEmits(['btnAction']);

    const handle_btn_action = (text: string) => {
        switch (text) {
            case 'Total Contacts':
                emit('btnAction', 'new_contact');
                break;
            case 'Total Groups':
                emit('btnAction', 'new_group');
                break;
            case 'Total DNC':
                emit('btnAction', 'dnc');
                break;
            default:
                break;
        }
    }
</script>