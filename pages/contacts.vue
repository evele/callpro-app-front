<template>
    <div>
        <p class="text-title">Contact page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error?.message }}</span>        
    </div>
    <h2 style="margin: 2rem 0 0 10px">Contacts</h2>
    <ul class="tab-style">
        <li v-for="option in tab_options" :key="option" class="tab-style__li"
            :class="[selected_tab === option ? 'selected-tab' : '']" @click="selected_tab = option">
            {{ option}}
        </li>
    </ul>

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

    <div class="filter-container">
        <div>
            <label for="show" style="margin-right: 6px;">Show:</label>
            <select name="show" id="show" v-model="show">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>

        <div>
            <label for="search" style="margin-right: 6px;">Search:</label>
            <input type="text" name="search" id="search" placeholder="Search..." @input="debounceSearch">
        </div>
        <div>
            <label for="page_number" style="margin-right: 6px;">Pagina nro:</label>
            <input type="number" name="page_number" id="page_number" placeholder="nro pagina..." v-model.number="page">
        </div>
    </div>
    <p v-if="isLoading">Loading broadcasts...</p>
    <p v-if="isError">{{ error?.message }}</p>
    <ul v-if="isSuccess && all_contacts_data && 'contacts' in all_contacts_data" class="contact-list">
        <li v-for="contact in all_contacts_data?.contacts" :key="contact.id" class="contact-item">            
            <span class="contact-label">Contact ID:</span><span class="contact-value">{{ contact.id }}</span>
            <span class="contact-label">Name:</span><span class="contact-value">{{contact.last_name}}, {{contact.first_name}}</span>              
        </li>
    </ul>

    <ContactsActions />
    <ModalAddNewContact ref="modalAddNewContact" />
</template>

<script setup lang="ts">  
    const tab_options = [CONTACTS_ALL,UNASSIGNED,TRASH]
    const page = ref(1)    
    const show = ref(10)
    const search = ref("")    

    const selected_tab = ref(CONTACTS_ALL)    
    const with_groups = ref(true)
    const is_custom_group = ref(false)
    const groupName = ref('')
    const launchID = ref('')
    const groupID = ref('')

    const modalAddNewContact = ref()

    const { data: all_contacts_data, error, isLoading,isSuccess, isError, refetch } = useFetchAllContacts(page,show,with_groups,is_custom_group,selected_tab,search) 
    const { mutate: saveGroupContacts, isPending: saveGroupContactsIsPending, isError: saveGroupContactsIsError, error: saveGroupContactsError, isSuccess: saveGroupContactsIsSuccess } = useSaveGroupContacts()
    
    let searchDebounce: ReturnType<typeof setTimeout> // TODO: check if this works
   
    const debounceSearch = (e: Event) => {        
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            const target = e.target as HTMLInputElement;
            search.value = target.value
        }, 500) 
    }
   
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
</style>