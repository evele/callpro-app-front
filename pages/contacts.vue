<template>
    <section class="bg-white py-5 pl-8 mb-4 flex gap-3 items-center">
        <p class="text-[25px] font-semibold">{{ selected_group.group_name }} 
            <span v-if="is_custom_group" class="text-[#939091] text-[21px] font-light italic ml-1">
                #{{ selected_group.group_id }}
            </span>
        </p>
        <Button v-if="is_custom_group" @click="console.log('edit_group')" class="rounded-full p-0 bg-[#E8DEF8] w-[32px] h-[32px] border-none shadow-md hover:scale-110 transition-transform">
            <EditIconSVG class="text-[#1E1E1E] w-4 h-4" />
        </Button>
    </section>

    <div class="py-5 main-container gap-4 px-10">
        <ContactsTable :selected-group="selected_group.group_id" @uploadFile="open_contacts_modal" @updateMessage="handle_update_message" 
            :dnc-total-numbers="dnc_total_contacts" :is-custom-group="is_custom_group" />
        <div class="flex flex-col gap-4">
            <ContactsActions @click="open_contacts_modal" :dnc-total-numbers="dnc_total_contacts" />
            <ContactsGroupsPanel :selected-group="selected_group.group_id" @selectedGroup="handle_group_selection" />
        </div>
    </div>

    <ModalContacts ref="modalContacts" :selected-group="selected_group.group_id" @updateMessage="handle_update_message" />

    <ConfirmDialog class="confirm-dialog">
        <template #message>
            <p class="mb-6 text-lg font-semibold">{{ message_text }}</p>
        </template>
    </ConfirmDialog>
    <Toast />
</template>

<script setup lang="ts">
    const modalContacts = ref()
    const selected_group = ref<SelectedGroup>({ group_name: 'All', group_id: CONTACTS_ALL })
    const is_custom_group = ref(false)
    const message_text = ref('')
    // TODO: review logic between selected_group, selected_tab, editing group

    type SelectedGroup = { group_name: string, group_id: string }

    /* ----- DNC Contacts ----- */
    const page = ref(1)
    const show = ref(0)
    const search = ref('')
    const dnc_total_contacts = ref<number | null>(null)

    const { data: dnc_contacts } = useFetchDNCContacts(page,show,search)

    const dnc_contacts_value = computed(() => dnc_contacts.value);

    watch(dnc_contacts_value, (updated_data: GetDNCContactsAPIResponse | APIResponseError | undefined) => {
        if (updated_data && updated_data?.result) {
            dnc_total_contacts.value = updated_data.dnc_total_contacts;
        } else {
            dnc_total_contacts.value = -1;
        }
    });

    /* ----- Open contacts modal ----- */
    const open_contacts_modal = (section: SectionToShow) => {
        if(!section) return
        modalContacts.value.open(section);
    }

    /* ----- Confirm Dialog ----- */
    const handle_update_message = (message: string) => {
        message_text.value = message
    }

    /* ----- Contacts Groups Panel ----- */
    const handle_group_selection = (button_name: string, button_group_id: string, is_custom: boolean) => {
        selected_group.value = { group_name: button_name, group_id: button_group_id }
        is_custom_group.value = is_custom
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