<template>
    <Dialog v-model:visible="show_sub_modal" modal :draggable="false" :closable="false" class="w-full max-w-[800px] mx-4 flex flex-col gap-4 md:gap-7 pb-8">
        <template #header>
            <header class="w-full flex justify-between pb-5 px-8">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">{{ title }}</h2>
                <Button @click="close_modal" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <UploadAudio v-if="sectionToShow === 'upload'" @close="handleClose" @success="handleSuccess" @error="handleError" />
        <AddAudioTTS v-if="sectionToShow === 'tts'" @close="handleClose" @success="handleSuccess" @error="handleError" />
    </Dialog>
</template>

<script setup lang="ts">
    const props = defineProps({
        sectionToShow: { type: String, required: true }
    })

    const show_sub_modal = ref(false);

    const title = computed(() => props.sectionToShow === 'upload' ? 'Upload new audio file' : 'Add Audio from TTS');

    const open_modal = () => {
        show_sub_modal.value = true;
    }

    const close_modal = () => {
        show_sub_modal.value = false;
    }

    const emit = defineEmits(['update:audios']);
    defineExpose({ open_modal });

    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const handleClose = () => close_modal();

    const handleSuccess = (message: string) => {
        show_success_toast('Success', message)
        handleClose()
        emit('update:audios')
    }
    const handleError = (error: string) => show_error_toast('Error', error);
</script>