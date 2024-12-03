<template>
    <div class="p-6 mb-10">       
        <Card class="bg-white">
            <template #content>
                <ButtonsLibraryContainer @action="handle_btn_action" />
                <AudiosTable />
            </template>  
        </Card>
    </div>
    <ModalAddAudioTTS ref="addAudioTTSRef"/>
</template>

<script setup lang="ts">
    const addAudioTTSRef = ref()  

    const handle_btn_action = (action: string) => {
        if (action === 'tts') {
            addAudioTTSRef?.value?.open()
        }
    }
</script>

<style scoped>
    .btn-convert {
        padding: .7rem 1.2rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 1rem;
    }
    textarea {
        display: block;
        margin-bottom: 1rem;
    }
</style>