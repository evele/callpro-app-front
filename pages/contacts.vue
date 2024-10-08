<template>
    <div>
        <p class="text-title">Contact page</p>
    </div>
    <div class="py-5 main-container">
        <ContactsTable :selected-tab="selected_tab" />
        <div>
            <ContactsActions />
            <ContactsGroupsPanel />
        </div>
    </div>
    <Button label="Save Custom Groups" @click="open_modal" />
   
    <SaveCustomGroups ref="saveCustomGroups" @editar_my_groups="handleEditGroup"/>

    <Button label="Add new contact" @click="open_new_contact_modal" />

    <ContactsActions />
    <ModalAddNewContact ref="modalAddNewContact" />
</template>

<script setup lang="ts">

const selected_tab = ref(CONTACTS_ALL)

const saveCustomGroups = ref();

const { mutate: saveGroupContacts, isPending: saveGroupContactsIsPending, isError: saveGroupContactsIsError, error: saveGroupContactsError, isSuccess: saveGroupContactsIsSuccess } = useSaveGroupContacts()

const save_new_group = () => {
        const dataToSend = {
            name: groupName.value,
            id: groupID.value ? parseInt(groupID.value, 10) : null,
            phone_launch_id: launchID.value ? parseInt(launchID.value, 10) : null
        } 
        saveGroupContacts(dataToSend)
}


const open_modal = () => {
    console.log("abriendo")
    saveCustomGroups.value.open();
}

const modalAddNewContact = ref()


const open_new_contact_modal = () => {
    modalAddNewContact.value.open();
}
</script>

<style scoped>
.text-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
}

.tab-style {
    display: flex;
    list-style-type: none;
    padding: 0;
    gap: 1rem;
    margin-left: 1rem;
}

.tab-style__li {
    color: gray;
    background-color: transparent;
    transition: background-color 0.3s;
    font-weight: bold;
    border: 1px solid gray;
    padding: 6px 1rem;
    font-size: 14px;
}

.tab-style__li:hover {
    cursor: pointer;
    color: white;
    background-color: gray;
}

.selected-tab {
    color: white;
    background-color: orange;
}

.filter-container {
    display: flex;
    gap: 1.4rem;
    margin: 1rem 0 0 1rem;
}

.contact-list {
    list-style-type: none;
    padding: 0;
    margin: 1rem 0;
    border: 1px solid #ccc;
    border-collapse: collapse;
}

.contact-item {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.contact-item:last-child {
    border-bottom: none;
}

.contact-label {
    font-weight: 600;
    margin-right: 6px;
}

.contact-value {
    margin-right: 10px;
    color: blue;
}

.main-container {
    background-color: var(--body-background);
    overflow-x: hidden;
    display: grid;
    grid-template-columns: 1fr auto;
}
</style>