<template>
    <div>
        <Button @click="open_modal">Open contacts modal</Button>
        <ModalContacts ref="modalContacts" />
    </div>
</template>

<script setup lang="ts">

    const modalContacts = ref(null);

    const open_modal = () => {
        modalContacts.value.open();
    }
</script>