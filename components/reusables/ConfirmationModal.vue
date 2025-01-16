<template>
    <Dialog v-model:visible="show_confirmation_modal" modal :draggable="false" :closable="false" class="w-full mx-4" :style="{ maxWidth: maxWidth }">
        <template #header>
            <header class="w-full flex items-center justify-between px-8">
                <h2 class="font-bold text-xl text-black">{{ title }}</h2>
                <Button @click="close" class="bg-transparent border-none px-2 text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
        </template>
        <slot />
        <template #footer>
            <footer class="flex flex-col w-full justify-center gap-4 sm:gap-6 font-bold mt-8 sm:flex-row">
                <Button @click="close" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
                    Cancel
                </Button>
                <Button @click="handle_confirm" :disabled="isDisabled" class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E] disabled:bg-[#653494]">
                    Confirm
                </Button>
            </footer>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: { type: String, required: true, default: '' },
        isDisabled: { type: Boolean, required: false, default: false },
        maxWidth: { type: String, required: false, default: '580px' }
    })

    const show_confirmation_modal = ref(false)

    const emit = defineEmits(['confirm', 'cancel'])

    const open = () => show_confirmation_modal.value = true

    const close = () => {
        emit('cancel')
        show_confirmation_modal.value = false
    }

    const handle_confirm = () => {
        emit('confirm')
        show_confirmation_modal.value = false
    }

    defineExpose({ open })
</script>