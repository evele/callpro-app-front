<template>
    <div class="py-5 main-container gap-4 px-10">
        <ContactsTable 
            :selected-tab="selected_tab" 
            @uploadFile="open_contacts_modal" 
            @updateMessage="handle_update_message" 
            :dnc-total-numbers="total_dnc_count" 
            :system-groups="system_groups" 
            :custom-groups="custom_groups" 
        />
        <div class="flex flex-col gap-4">
            <ContactsActions 
                @click="open_contacts_modal" 
                :total-contacts-number="total_contacts_count" 
                :total-groups-number="total_custom_groups_count" 
                :total-dnc-number="total_dnc_count" 
            />
            <ContactsGroupsPanel :selected-tab="selected_tab" />
        </div>
    </div>

    <ModalContacts ref="modalContacts" :selected-tab="selected_tab" @updateMessage="handle_update_message" />

    <ConfirmDialog class="confirm-dialog">
        <template #message>
            <p class="mb-6 text-lg font-semibold">{{ message_text }}</p>
        </template>
    </ConfirmDialog>
    <Toast />
</template>

<script setup lang="ts">
    const modalContacts = ref()
    const selected_tab = ref(CONTACTS_ALL)
    const message_text = ref('')
    // TODO: review logic between selected_group, selected_tab, editing group

    /* ----- System Groups ----- */
    const { data: SGData } = useFetchGetSystemGroups()
    const system_groups = computed<SystemGroup | null>(() => {
        if(!SGData?.value?.result) return null
        return SGData?.value.system_groups
    })

    const total_contacts_count = computed(() => {
        if(!SGData?.value?.result) return null
        const data = SGData?.value.system_groups
        return Number(data.not_trash)
    })

    /* ----- Custom Groups ----- */
    const { data: CGData} = useFetchGetCustomGroups() 
    const custom_groups = computed(() => {
        if(!CGData?.value?.result) return []
        return CGData?.value.custom_groups
    })

    const total_custom_groups_count = computed(() => {
        if(!CGData?.value?.result) return null
        const data = CGData?.value.custom_groups
        return data.length
    })

    /* ----- DNC Contacts ----- */
    const page = ref(1)
    const show = ref(0)
    const search = ref('')

    const { data: dnc_contacts } = useFetchDNCContacts(page,show,search)

    const total_dnc_count = computed(() => {
        const data = dnc_contacts?.value;
        return data && data?.result ? data?.dnc_total_contacts : null;
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