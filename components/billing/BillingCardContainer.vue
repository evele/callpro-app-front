<template>
    <div class="max-w-[540px] w-full rounded-2xl p-3 h-56 bg-white">
        <div class="border py-3 px-4 rounded-xl h-full flex flex-col justify-between" :class="theme">
            <h3 class="text-lg font-semibold text-dark-3">{{ props.title }}</h3>

            <slot name="content" />
            <div class="flex justify-end gap-4"><slot name="footer" /></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        title: string;
        type: 'credits' | 'monthly' | 'card';
    }>();

    const theme = computed(() => {
        switch (props.type) {
            case 'credits':
                return 'bg-[#fcfff4] border-text-secondary-hover'
            case 'monthly':
                return 'bg-[#f5f2fb] border-text-primary'
            case 'card':
                return 'bg-[#f4f4f4] border-text-grey-9'
            default:
                return 'bg-[#f4f4f4] border-text-grey-9'
        }
    });
</script>