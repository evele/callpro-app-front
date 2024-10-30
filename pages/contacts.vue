<template>
    <div>
        <p class="text-center text-2xl text-bold">Contact page</p>
    </div>
    <div class="py-5 main-container">
        <ContactsTable :selected-tab="selected_tab" />
        <div class="flex flex-col gap-4">
            <ContactsActions />
            <ContactsGroupsPanel />
        </div>
    </div>    

    <Button label="Add new contact" @click="open_new_contact_modal" />

    <ModalAddNewContact ref="modalAddNewContact" />
</template>

<script setup lang="ts">

const selected_tab = ref(CONTACTS_ALL)

const modalAddNewContact = ref()

const open_new_contact_modal = () => {
    modalAddNewContact.value.open();
}
</script>

<style scoped>
.main-container {
    background-color: var(--body-background);
    overflow-x: hidden;
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0 30px;
}
</style>