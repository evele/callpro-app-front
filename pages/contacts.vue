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
        <ContactsTable 
            :selected-group="selected_group.group_id" 
            @uploadFile="open_contacts_modal" 
            @updateMessage="handle_update_message" 
            :dnc-total-numbers="total_dnc_count" 
            :is-custom-group="is_custom_group" 
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
    const open_contacts_modal = (section: ContactsModalSectionToShow) => {
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