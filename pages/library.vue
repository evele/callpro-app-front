<template>
    <Page>
        <template #header>
            <PageHeader text="Library"/>
        </template>
        <template #content>
            <Button class="add-new-btn mx-auto" @click="open_modal">            
            <span class="add-new-text">Modal Add Audio TTS</span>
            <ModalAddAudioTTS v-if="isModalOpen" @close="close_modal"/>
        </Button>
        </template>
   </Page>
</template>
<script setup lang="ts">

const isModalOpen = ref(false);

const open_modal = () => {
    isModalOpen.value = true;
};

const close_modal = () => {
    isModalOpen.value = false;
};

</script>