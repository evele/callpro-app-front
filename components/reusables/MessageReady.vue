<template>
    <Dialog v-model:visible="show_ready_message" pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-full max-w-[580px] p-8" pt:mask:class="bg-white bg-opacity-70 backdrop-blur-[2px]">
        <template #container>
            <div class="flex flex-col justify-center items-center gap-4">
                <div class="relative">
                    <CircleEmptySVG class="w-[72px] h-[72px] text-green-positive-primary" />
                    <CheckSVG class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] text-green-positive-primary" />
                </div>
                <span class="text-black text-lg leading-none">Ready!</span>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const props = defineProps<{
        isVisible: boolean
    }>()

    const show_ready_message = computed(() => props.isVisible)
</script>