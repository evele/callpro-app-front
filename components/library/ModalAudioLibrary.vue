<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex items-center justify-between px-8 border-b pb-6">
                <PopoverOption :options="menuOptions" :selected-option="selected_option" @optionSelected="handleOptionSelected" />
                <Button @click="close" class="bg-transparent border-none  px-2 text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
        </template>

        <UploadAudio v-if="section_to_show === 'upload'" @close="handleClose" @success="handleSuccess" @error="handleError" />
        <AddAudioTTS v-if="section_to_show === 'tts'" @close="handleClose" @success="handleSuccess" @error="handleError" />
        <CallInCodes v-if="section_to_show === 'call_in'" @close="handleClose" @success="handleSuccess" @error="handleError" />
            
        <template #footer />
    </Dialog>
</template>

<script setup lang="ts">
    const visible = ref(false)

    const section_to_show = ref<AudioLbryModalSectionToShow>('')
    const selected_option = ref('')

    const menuOptions = computed(() => [
        { id: 'upload', text: "Upload new audio file" },
        { id: 'tts', text: "Add Audio from TTS" },
        { id: 'call_in', text: "Call in Audio" },
    ]);

    const handleOptionSelected = (selectedOption: AudioLbryModalSectionToShow) => {
        selected_option.value = selectedOption
        section_to_show.value = selectedOption
    };

    const open = (section: AudioLbryModalSectionToShow) => {
        section_to_show.value = section
        selected_option.value = section
        visible.value = true;
    }

    const close = () => {
        section_to_show.value = ''
        selected_option.value = ''
        visible.value = false;
    }

    defineExpose({ open })

    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const handleClose = () => close()

    const handleSuccess = (message: string) => show_success_toast('Success', message)

    const handleError = (error: string) => show_error_toast('Error', error)
</script>