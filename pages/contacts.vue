<template>
    <section class="bg-white py-1 pl-8 flex gap-3 items-center flex-wrap">
        <p v-if="selected_groups.length > 3" class="text-2xl font-semibold">{{ selected_groups.length }} groups selected</p>
        <div v-else v-for="(group, index) in selected_groups" :key="group.group_id" class="flex gap-3 items-center">
            <p class="text-2xl font-semibold">{{ group.group_name }} {{ selected_groups.length > 1 && index < selected_groups.length - 1 && !group.is_custom ? ',' : '' }}
                <span v-if="group.is_custom" class="text-[#939091] text-[21px] font-light italic ml-1">
                    {{ group.group_code ? 'ID ' + group.group_code : null }}
                </span>
            </p>
            <Button v-if="!group.is_custom" @click="open_contacts_modal(CONTACT)" icon="pi" variant="text" raised rounded aria-label="Bookmark" class="ml-2 bg-light-purple border-none w-6 h-6 hover:scale-125 transition-transform hover:bg-light-purple-2">
                <PlusSVG class="w-3 h-3 text-dark-3" />
            </Button>
            <Button v-if="group.is_custom" @click="open_edit_group" class="rounded-full p-0 bg-[#E8DEF8] w-6 h-6 border-none shadow-md hover:scale-125 transition-transform hover:bg-light-purple-2">
                <EditIconSVG class="text-dark-3 w-4 h-4" />
            </Button>
            <span v-if="selected_groups.length > 1 && index < selected_groups.length - 1 && group.is_custom" class="text-2xl font-semibold">,</span>
        </div>
        
    </section>

    <div class="py-5 main-container gap-4 px-10">
        <ContactsTable ref="contactsTableRef"
            :selected-groups="selected_groups" 
            @uploadFile="open_contacts_modal"
            @update:contactToEdit="handle_edit_contact"
            :dnc-total-numbers="total_dnc_count" 
            :is-custom-group="is_custom_group" 
            :system-groups="system_groups"
            :custom-groups="custom_groups"
            @update:filters="handle_filters_selection"
        />
        <div class="flex flex-col gap-4">
            <ContactsActions 
                @click="handle_contacts_action" 
                :total-contacts-number="total_contacts_count" 
                :total-groups-number="total_custom_groups_count" 
                :total-dnc-number="total_dnc_count" 
            />

            <ContactsGroupsPanel 
                :selected-groups="selected_groups" 
                :system-groups="system_groups"
                @selectedGroup="handle_group_selection" 
                @update:table="handle_update_table" 
                @openContactsModal="handle_open_contacts_modal_from_groups_panel"
            />
        </div>
    </div>

    <ModalContacts 
        ref="modalContacts" 
        :selected-group="selected_groups[0].group_id"
        :selected-contact="selected_contact"
        :group-to-edit="selected_group_to_edit"
        @reset="handle_reset_values"
        @update:table="handle_update_table"
    />

    <Toast />
</template>

<script setup lang="ts">
    const modalContacts = ref()
    const selected_groups = ref<ContactSelectedGroup[]>([{ group_name: 'All', group_id: CONTACTS_ALL, is_custom: false, group_code:'' }])
    const selected_group_to_edit = reactive<SelectedGroupToEdit>({
            groupID: '',
            groupName: '',
            launchID: ''
    })
    const is_custom_group = ref(false)
    const selected_contact = ref<ContactToEdit | null>(null)
    const contactsTableRef = ref()
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
    const open_contacts_modal = (section: ContactsModalSectionToShow) => {
        if(!section) return
        modalContacts.value.open(section);
    }

    const handle_reset_values = () => {
        selected_contact.value = null
    }

    const handle_update_table = () => {
        contactsTableRef.value?.reset_selected_contacts(true, true, false)
    }

    const handle_contacts_action = (action_id:ContactsModalSectionToShow) => {
        if (action_id == NEW_GROUP){
            Object.assign(selected_group_to_edit, {
            groupID: '',
            groupName: '',
            launchID: ''
            });
        }
        open_contacts_modal(action_id)
    }

    const open_edit_group = () => {
        Object.assign(selected_group_to_edit, {
            groupID: selected_groups.value[0].group_id,
            groupName: selected_groups.value[0].group_name,
            launchID: selected_groups.value[0].group_code
        });
        open_contacts_modal(NEW_GROUP)
    }

    /* ----- Contacts Groups Panel ----- */
    const handle_group_selection = (button_name: string, button_group_id: string, is_custom: boolean, group_code:StringOrNull) => {
        contactsTableRef.value?.reset_selected_contacts()
        selected_groups.value = [{ group_name: button_name, group_id: button_group_id, is_custom, group_code: group_code || '' }]
        is_custom_group.value = is_custom
    }

    const handle_open_contacts_modal_from_groups_panel = (selected_group: SelectedGroupToEdit) => {
        Object.assign(selected_group_to_edit, selected_group);
        open_contacts_modal('new_group')
    }

    /* ----- Contacts Table ----- */
    const handle_filters_selection = (selected_filters: {group_name: string, group_id: string, is_custom: boolean, group_code: string}[]) => {
        selected_groups.value = selected_filters
    }

    const handle_edit_contact = (contact: ContactToEdit) => {
        selected_contact.value = contact
        open_contacts_modal(CONTACT)
    }
</script>

<style scoped>
.main-container {
    background-color: var(--body-background);
    display: grid;
    justify-content: space-around;
    grid-template-columns: minmax(auto, 1200px) minmax(auto, 220px);
}

@media (min-width: 1440px) {
    .main-container {
        grid-template-columns: minmax(auto, 1200px) minmax(auto, 250px);
    }
}

@media (min-width: 1920px) {
    .main-container {
        grid-template-columns: minmax(auto, 1200px) minmax(auto, 280px);
    }
}
</style>