<template>
    <div class="p-6 mb-10">       
        <Card class="bg-white">
            <template #content>
                <ButtonsLibraryContainer @action="open_audio_lbry_modal" />
                <AudiosTable />
            </template>  
        </Card>
    </div>
    <ModalAudioLibrary ref="modalAudioLibrary" />
</template>

<script setup lang="ts">
    const modalAudioLibrary = ref()

    const open_audio_lbry_modal = (section: AudioLbryModalSectionToShow) => {
        if(!section) return
        modalAudioLibrary.value.open(section);
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