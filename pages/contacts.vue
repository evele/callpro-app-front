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
    <div class="new-group-container">
        <h2>Create New Group</h2>
        <div class="form-group">
            <label for="group_name">Group Name:</label>
            <input type="text" id="group_name" v-model="groupName" placeholder="Enter group name" />
        </div>
        <div class="form-group">
            <label for="launch_id">Phone Launch ID:</label>
            <input type="number" id="launch_id" v-model="launchID" min="1" placeholder="Enter Phone Launch ID" />
            <input type="number" id="group_id" v-model="groupID" placeholder="Enter Group ID" />
        </div>
        <button @click="save_new_group">{{ !saveGroupContactsIsPending ? 'Save new group' : 'Saving...' }}</button>
         <div style="margin-top: 10px;">
            <span v-if="saveGroupContactsIsError" style="color: red;">Error: {{ saveGroupContactsError?.message }}</span>
            <span v-if="saveGroupContactsIsSuccess" style="color: green;">Contact group successfully updated!</span>
        </div>
    </div>

    <Button label="Add new contact" @click="open_new_contact_modal" />

    <ContactsActions />
    <ModalAddNewContact ref="modalAddNewContact" />
</template>

<script setup lang="ts">
    const selected_tab = ref(CONTACTS_ALL)    
    
    const groupName = ref('')
    const launchID = ref('')
    const groupID = ref('')

    const modalAddNewContact = ref()

    const { mutate: saveGroupContacts, isPending: saveGroupContactsIsPending, isError: saveGroupContactsIsError, error: saveGroupContactsError, isSuccess: saveGroupContactsIsSuccess } = useSaveGroupContacts()
   
    const save_new_group = () => {
        const dataToSend = {
            name: groupName.value,
            id: groupID.value ? parseInt(groupID.value, 10) : null,
            phone_launch_id: launchID.value ? parseInt(launchID.value, 10) : null
        } 
        saveGroupContacts(dataToSend)
    }

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