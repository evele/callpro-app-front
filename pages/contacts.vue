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
        <ContactsTable ref="contactsTableRef"
            :selected-group="selected_group.group_id" 
            @uploadFile="open_contacts_modal" 
            @updateMessage="handle_update_message"
            @updateGroup="handle_move_or_add_to_group"
            :dnc-total-numbers="total_dnc_count" 
            :is-custom-group="is_custom_group" 
            :system-groups="system_groups" 
            :custom-groups="custom_groups"
            :is-adding="ATGIsPending"
            :is-moving="MTGIsPending"
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
            <p v-if="!is_adding_or_moving" class="mb-6 text-lg font-semibold">{{ message_text }}</p>
            <div v-if="is_adding_or_moving" class="flex flex-col gap-4 mb-6">
                <p class="text-lg font-semibold">{{ message_text }}</p>
                <MultiSelect v-model="target_groups_ui" :options="custom_groups_options" optionLabel="name" 
                    display="chip" class="w-full max-w-[300px] sm:max-w-[490px] mx-auto" placeholder="Choose many..." :maxSelectedLabels="4" />
            </div>
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

    /* ----- Contacts Table ----- */
    const { mutate: moveNumberToGroup, isPending: MTGIsPending } = useMoveNumberToGroup()
    const { mutate: addNumberToGroup, isPending: ATGIsPending } = useAddNumberToGroup()
    
    const confirm = useConfirm()
    const { show_success_toast, show_error_toast } = usePrimeVueToast();
    const is_adding_or_moving = ref(false)
    const target_groups_ui = ref<SelectOption[]>([])
    const contactsTableRef = ref()

    const reset_dialog_state = () => {
        is_adding_or_moving.value = false
        target_groups_ui.value = []
    }

    const confirm_modal_handle_group = (action: 'move' | 'add', numbers_id: { number_id: string }[]) => {
        message_text.value = action === 'add' ? 'Are you sure you want to add the numbers to this group(s)?'
                                              : 'Are you sure you want to move the numbers to this group(s)?';

        confirm.require({
            header: 'Confirmation',
            rejectProps: {
                label: 'No',
                severity: 'secondary'
            },
            acceptProps: {
                label: 'Yes'
            },
            onHide: () => reset_dialog_state(),
            accept: () => {
               if(action === 'add') {
                    const formatted_target_groups = target_groups_ui.value.map((group: SelectOption) => group.code)
                    const data_to_send: AddNumberToGroup = {
                        number_id: numbers_id,
                        groups: formatted_target_groups,
                    }
                    addNumberToGroup(data_to_send, {
                        onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                            if(response.result) {
                                contactsTableRef.value?.reset_selected_contacts()
                                show_success_toast('Success!', 'Numbers added!')
                            } else {
                                show_error_toast('Error', 'Something failed while adding numbers...')
                            }
                        },
                        onError: () => show_error_toast('Error', 'Something failed while adding numbers...')
                    })
               } else {
                    const formatted_target_groups = target_groups_ui.value.map((group: SelectOption) => group.code)
                    const data_to_send: MoveNumberToGroup = {
                        number_id: numbers_id,
                        groups: formatted_target_groups,
                        current_group_id: selected_group?.value?.group_id
                    }
                    moveNumberToGroup(data_to_send, {
                        onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                            if(response.result) {
                                contactsTableRef.value?.reset_selected_contacts()
                                show_success_toast('Success!', 'Numbers moved!')
                            } else {
                                show_error_toast('Oops...', 'Something failed while moving numbers...')
                            }
                        },
                        onError: () => show_error_toast('Oops...', 'Something failed while moving numbers...')
                    })
               }
               reset_dialog_state()
            },
            reject: () => reset_dialog_state()
        });
    };

    const handle_move_or_add_to_group = (action: 'move' | 'add', numbers_id: { number_id: string }[]) => {
        is_adding_or_moving.value = true
        confirm_modal_handle_group(action, numbers_id)
    }

    const custom_groups_options = computed(() => {
        if (custom_groups.value?.length) {
            return custom_groups.value.filter((group: CustomGroup) => group.id != selected_group.value.group_id).map((group: CustomGroup) => {
                return {
                    name: group.group_name,
                    code: group.id
                }
            })
        }
        return []
    })
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