<template>
    <Dialog v-model:visible="show_modal" pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-full max-w-[580px] p-8" pt:mask:class="bg-white bg-opacity-70 backdrop-blur-[2px]">
        <template #container>
            <div class="flex flex-col justify-center items-center gap-6">
                <AlertSVG class="w-24 h-24 text-pending" />
                <span class="text-black text-lg leading-none">{{ props.message }}</span>
            </div>

            <footer class="flex justify-center w-full font-bold mt-[38px]">
                <Button @click="emit('close')" class="w-[180px]">Ok</Button>
            </footer>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const props = defineProps<{
        isVisible: boolean
        message: string
    }>()

    const emit = defineEmits<{
        (event: 'close'): void
    }>()

    const show_modal = computed(() => props.isVisible)
</script>