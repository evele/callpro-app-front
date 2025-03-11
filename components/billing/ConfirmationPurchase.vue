<template>
    <Dialog v-model:visible="show_confirm" :draggable="false" :closable="false"
        pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-full max-w-[580px]" pt:mask:class="bg-white bg-opacity-70 backdrop-blur-[2px]"
    >
        <template #container>
            <header class="w-full flex items-center justify-between px-8 pt-6 mb-2">
                <h2 class="font-bold text-2xl text-dark-3">{{ props.title }}</h2>
                <Button @click="close_confirm" class="bg-transparent border-none px-2 text-grey-4 hover:bg-gray-200"><CloseSVG /></Button>
            </header>

            <p class="text-dark-3 px-8">{{ props.message }}</p>

            <footer class="flex justify-end gap-4 font-medium px-8 pb-6 mt-6">
                <Button 
                    @click="handle_cancel"
                    :disabled="props.isProcessingConfirm || props.isProcessingCancel"
                    class="bg-[#F5F5F5] border border-grey-14 text-dark-3 rounded-lg w-fit h-10 sm:max-w-[300px] hover:bg-[#E5E5E5]"
                >
                    <div class="flex items-center gap-2" v-if="props.isProcessingCancel">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 dark-spinner" animationDuration=".5s" aria-label="Processing" />
                        Processing...
                    </div>
                    <span v-else>{{ props.cancelText }}</span>
                </Button>

                <Button 
                    @click="handle_confirm"
                    :disabled="props.isProcessingConfirm || props.isProcessingCancel"
                    class="bg-primary rounded-lg border-primary text-white w-fit sm:max-w-[300px] h-10 hover:bg-[#4A1D6E] disabled:bg-primary"
                >
                    <div class="flex items-center gap-2" v-if="props.isProcessingConfirm">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner" animationDuration=".5s" aria-label="Processing" />
                        Processing...
                    </div>
                    <span v-else>{{ props.confirmText }}</span>
                </Button>
            </footer>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        isVisible: boolean
        title: string
        message: string
        cancelText?: string
        confirmText?: string
        isProcessingConfirm: boolean
        isProcessingCancel?: boolean
    }>(), {
        title: 'Confirm your purchase',
        message: 'Are you sure you want to confirm this purchase?',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        isProcessingConfirm: false,
        isProcessingCancel: false
    })

    const show_confirm = computed(() => props.isVisible)

    const emit = defineEmits(['close', 'cancel', 'confirm'])
    const close_confirm = () =>  emit('close')
    const handle_cancel = () =>  emit('cancel')
    const handle_confirm = () => emit('confirm')
</script>
<style scoped lang="scss">
:deep(.light-spinner) {
    .p-progressspinner-circle {
        stroke: white!important;
    }
}
:deep(.dark-spinner) {
    .p-progressspinner-circle {
        stroke: #757575!important;
    }
}
</style>