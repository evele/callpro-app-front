<template>
    <section class="bg-white py-5 pl-8 mb-4 flex gap-3 items-center flex-wrap">
        <p v-if="selected_groups.length > 3" class="text-[25px] font-semibold">{{ selected_groups.length }} groups selected</p>
        <div v-else v-for="(group, index) in selected_groups" :key="group.group_id" class="flex gap-3 items-center">
            <p class="text-[25px] font-semibold">{{ group.group_name }} {{ selected_groups.length > 1 && index < selected_groups.length - 1 && !group.is_custom ? ',' : '' }}
                <span v-if="group.is_custom" class="text-[#939091] text-[21px] font-light italic ml-1">
                    #{{ group.group_id }}
                </span>
            </p>
            <Button v-if="group.is_custom" @click="console.log('edit_group')" class="rounded-full p-0 bg-[#E8DEF8] w-[32px] h-[32px] border-none shadow-md hover:scale-110 transition-transform">
                <EditIconSVG class="text-[#1E1E1E] w-4 h-4" />
            </Button>
            <span v-if="selected_groups.length > 1 && index < selected_groups.length - 1 && group.is_custom" class="text-[25px] font-semibold">,</span>
        </div>
        
    </section>

    <div class="py-5 main-container gap-4 px-10">
        <ContactsTable ref="contactsTableRef"
            :selected-groups="selected_groups" 
            @uploadFile="open_contacts_modal"
            :dnc-total-numbers="total_dnc_count" 
            :is-custom-group="is_custom_group" 
            :system-groups="system_groups"
            :custom-groups="custom_groups"
            @update:filters="handle_filters_selection"
        />
        <div class="flex flex-col gap-4">
            <ContactsActions 
                @click="open_contacts_modal" 
                :total-contacts-number="total_contacts_count" 
                :total-groups-number="total_custom_groups_count" 
                :total-dnc-number="total_dnc_count" 
            />
            <ContactsGroupsPanel :selected-groups="selected_groups" @selectedGroup="handle_group_selection" />
        </div>
    </div>

    <ModalContacts ref="modalContacts" :selected-group="selected_groups[0].group_id" />

    <Toast />
</template>

<script setup lang="ts">
    const modalContacts = ref()
    const selected_groups = ref<ContactSelectedGroup[]>([{ group_name: 'All', group_id: CONTACTS_ALL, is_custom: false }])
    const is_custom_group = ref(false)
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

    /* ----- Contacts Groups Panel ----- */
    const handle_group_selection = (button_name: string, button_group_id: string, is_custom: boolean) => {
        selected_groups.value = [{ group_name: button_name, group_id: button_group_id, is_custom: is_custom }]
        contactsTableRef.value?.reset_selected_contacts()
    }

    /* ----- Contacts Table ----- */
    const handle_filters_selection = (selected_filters: {group_name: string, group_id: string, is_custom: boolean}[]) => {
        selected_groups.value = selected_filters
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