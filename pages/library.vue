<template>
    <Page>
        <template #header>
            <PageHeader text="Library"/>
        </template>
        <template #content>
            <Button class="add-new-btn mx-auto" @click="open_modal">            
                <span class="add-new-text">Modal Add Audio TTS</span>
            </Button>                       
            <ModalAddAudioTTS ref="isModalOpen" @update:convert_text="handlerConvertText" />
        </template>
    </Page>
</template>

<script setup lang="ts">

const isModalOpen = ref();

const open_modal = () => {
    isModalOpen.value?.open();
};

const handlerConvertText = (dataToSend: TextToConvert) => {

console.log("llegando desde componente", dataToSend)
}
</script>
