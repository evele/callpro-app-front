<template>
    <div>
        <p class="text-title">Contact page</p>
    </div>
    <div class="py-5 main-container gap-4 px-10">
        <ContactsTable :selected-tab="selected_tab" @uploadFile="modalUploadContacts.open()" @updateMessage="handle_update_message" />
        <div>
            <ContactsActions @click="handle_select_contact_action" :dnc-total-numbers="dnc_total_contacts" />
            <ContactsGroupsPanel />
        </div>
    </div>    

    <Button label="Add new contact" @click="open_new_contact_modal" />

    <ModalAddNewContact ref="modalAddNewContact" />
    
    <ModalUploadContacts ref="modalUploadContacts" :selected-group="selected_tab" />
    
    <ModalDNCContacts ref="modalDNCContacts" @updateMessage="handle_update_message" />

    <ConfirmDialog class="confirm-dialog">
        <template #message>
            <p class="mt-4 mb-6 text-lg font-semibold">{{ message_text }}</p>
        </template>
    </ConfirmDialog>
    <Toast />
</template>

<script setup lang="ts">
    const modalAddNewContact = ref()
    const modalUploadContacts = ref()
    const modalDNCContacts = ref()
    const selected_tab = ref(CONTACTS_ALL)
    const message_text = ref('')

    /* ----- DNC Contacts ----- */
    const page = ref(1)
    const show = ref(0)
    const search = ref('')
    const dnc_total_contacts = ref<number | null>(null)

    const { data: dnc_contacts, isLoading: dnc_is_loading, isSuccess: dnc_is_success, refetch: dnc_refetch } = useFetchDNCContacts(page,show,search)

    const dnc_contacts_value = computed(() => dnc_contacts.value);

    watch(dnc_contacts_value, (updated_data: GetDNCContactsAPIResponse | APIResponseError | undefined) => {
        if (updated_data && updated_data?.result) {
            dnc_total_contacts.value = updated_data.dnc_total_contacts;
        } else {
            dnc_total_contacts.value = -1;
        }
    });
    /* ----- DNC Contacts ----- */

    const open_new_contact_modal = () => {
        modalAddNewContact.value.open();
    }

    const handle_select_contact_action = (action: string) => {
        switch (action) {
            case 'dnc':
                modalDNCContacts.value.open()
                break;
            default:
                break;
        }
    }

    const handle_update_message = (message: string) => {
        message_text.value = message
    }

</script>

<style scoped lang="scss">
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