<template>
    <div v-if="!props.selectedGroups?.includes(TRASH)" class="flex items-center gap-2 relative">
        <ButtonWithIcon 
            @click="handle_group_action('add')" 
            :isDisabled="disabled_groups_action_btn" 
            :isLoading="ATGIsPending" 
            ariaText="Adding number" 
            btnText="Add to Group" 
            loadingText="Adding..."
        >
            <template #icon>
                <PlusRoundedSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon 
            @click="handle_group_action('move')" 
            :isDisabled="disabled_move_and_remove_btn" 
            :isLoading="MTGIsPending" 
            ariaText="Moving number" 
            btnText="Move to Group" 
            loadingText="Moving..."
        >
            <template #icon>
                <MoveSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon 
            v-if="props.isCustomGroup"
            @click="handle_group_action('remove')" 
            :isDisabled="disabled_move_and_remove_btn" 
            :isLoading="RFGIsPending" 
            ariaText="Removing number" 
            btnText="Remove from Group" 
            loadingText="Removing..."
        >
            <template #icon>
                <CloseSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon 
            v-if="props.selectedGroups?.length === 1 && props.isCustomGroup"
            @click="handle_group_action('trash')" 
            :isDisabled="disabled_groups_action_btn" 
            :isLoading="STTIsPending" 
            ariaText="Sending to trash" 
            btnText="Send to Trash" 
            loadingText="Sending..."
        >
            <template #icon>
                <TrashSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>
        <ProgressBar v-if="props.isLoading" mode="indeterminate" style="height: 6px" class="absolute w-full -bottom-4 left-0"></ProgressBar>
    </div>

    <div v-if="props.selectedGroups?.length && props.selectedGroups[0] === TRASH" class="flex items-center gap-2 relative">
        <ButtonWithIcon 
            @click="handle_group_action('delete')" 
            :isDisabled="disabled_groups_action_btn" 
            :isLoading="DCFIsPending" 
            ariaText="Deleting forever" 
            btnText="Delete Forever" 
            loadingText="Deleting..."
        >
            <template #icon>
                <TrashSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon 
            @click="handle_group_action('restore')" 
            :isDisabled="disabled_groups_action_btn" 
            :isLoading="RCIsPending" 
            ariaText="Restoring Contact" 
            btnText="Restore" 
            loadingText="Restoring..."
        >
            <template #icon>
                <RenewSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>
        <ProgressBar v-if="props.isLoading" mode="indeterminate" style="height: 6px" class="absolute w-full -bottom-4 left-0"></ProgressBar>
    </div>

    <ConfirmationModal ref="confirmationModal" :title="confirmation_title" :is-disabled="false" @confirm="handle_confirm_modal" @cancel="handle_cancel_modal">
        <p v-if="current_action === 'trash' || current_action === 'remove'" class="text-lg font-semibold">{{ message_text }}</p>
        <div v-if="current_action === 'add' || current_action === 'move'" class="flex flex-col gap-4">
            <p class="text-lg font-semibold">{{ message_text }}</p>
            <MultiSelect v-model="target_groups_ui" :options="custom_groups_options" optionLabel="name" 
                display="chip" class="w-full mx-auto" placeholder="Choose many..." :maxSelectedLabels="4" 
            />
            <Message v-if="current_action === 'move'" severity="error" class="mb-1"><span class="font-bold">Warning:</span> This action will replace the current group of this numbers with the selected ones!</Message>
        </div>
        <div v-if="current_action === 'delete'" class="flex flex-col gap-4">
            <p class="text-lg font-semibold">{{ message_text }}</p>
            <Message severity="error" class="mb-1"><span class="font-bold">Warning:</span> This action can not be undone!</Message>
        </div>
    </ConfirmationModal>
</template>

<script setup lang="ts">
    const props = defineProps<{
        selectedGroups: string[],
        isCustomGroup: boolean,
        customGroups: CustomGroup[],
        isLoading: boolean,
        selectedContacts: string[],
        selectedNumbers: string[],
    }>()

    const { mutate: sendNumberToTrash, isPending: STTIsPending } = useSendNumberToTrash()
    const { mutate: moveNumberToGroup, isPending: MTGIsPending } = useMoveNumberToGroup()
    const { mutate: addNumberToGroup, isPending: ATGIsPending } = useAddNumberToGroup()
    const { mutate: removeNumberFromGroup, isPending: RFGIsPending } = useRemoveNumberFromGroup()
    const { mutate: deleteContactForever, isPending: DCFIsPending } = useDeleteContactForever()
    const { mutate: restoreContact, isPending: RCIsPending } = useRestoreContact()
    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const emit = defineEmits(['update:table'])
    
    const target_groups_ui = ref<SelectOption[]>([])
    const confirmationModal = ref()
    const disabled_groups_action_btn = computed(() => props.selectedContacts?.length === 0 && props.selectedNumbers?.length === 0);
    const disabled_move_and_remove_btn = computed(() => {
        return (props.selectedContacts?.length === 0 && props.selectedNumbers?.length === 0) || props.selectedGroups?.length > 1
    })
    const confirmation_title = ref('')
    const message_text = ref('');

    type CurrentAction = 'add' | 'move' | 'remove' | 'trash' | 'delete' | 'restore' | ''
    const current_action = ref<CurrentAction>('')

    type SelectedNumberIds = NumberIdObject[]

    const custom_groups_options = computed(() => {
        if (props.customGroups?.length) {
            return props.customGroups?.filter((group: CustomGroup) => props.selectedGroups?.includes(group.id) ? null : group).map((group: CustomGroup) => {
                return {
                    name: group.group_name,
                    code: group.id
                }
            })
        }
        return []
    })

    const reset_confirmation_modal_state = () => {
        current_action.value = ''
        target_groups_ui.value = []
    }

    const handle_group_action = (action: CurrentAction) => {
        switch(action) {
            case 'add':
                current_action.value = 'add'
                confirmation_title.value = 'Add to group'
                message_text.value = 'Are you sure you want to add the numbers to this group(s)?'
                break;
            case 'move':
                current_action.value = 'move'
                confirmation_title.value = 'Move to group'
                message_text.value = 'Are you sure you want to move the numbers to this group(s)?'
                break;
            case 'remove':
                current_action.value = 'remove'
                confirmation_title.value = 'Delete number/contact'
                message_text.value = 'Are you sure you want to delete this number(s) from this group?'
                break;
            case 'trash':
                current_action.value = 'trash'
                confirmation_title.value = 'Confirmation'

                const many_numbers = props.selectedNumbers?.length > 1;
                message_text.value = many_numbers ? 'Are you sure you want to send these numbers to Trash?'
                                                : 'Are you sure you want to send this number to Trash?';
                break;
            case 'delete':
                current_action.value = 'delete'
                confirmation_title.value = 'Delete contact'
                message_text.value = 'Are you sure you want to delete this contact(s) permanently?'
                break;
            case 'restore':
                current_action.value = 'restore'
                handle_confirm_modal()
                return
            default:
                break;
        }

        confirmationModal.value?.open()
    }

    const handle_confirm_modal = () => {
        const numbers_id: NumberIdObject[] = props.selectedNumbers?.map((n_id: string) => ({ number_id: n_id }));

        switch(current_action.value) {
            case 'add':
                handle_add_to_group(numbers_id)
                break;
            case 'move':
                handle_move_to_group(numbers_id)
                break;
            case 'remove':
                handle_remove_from_group(numbers_id)
                break;
            case 'trash':
                handle_send_to_trash(numbers_id)
                break;
            case 'delete':
                handle_delete_contact(numbers_id)
                break;
            case 'restore':
                handle_restore_contact(numbers_id)
                break;
            default:
                break;
        }  
    };

    const handle_cancel_modal = () => {
        reset_confirmation_modal_state()
    }

    /* ----- ADD TO GROUP ----- */
    const handle_add_to_group = (numbers_id: SelectedNumberIds) => {
        const formatted_target_groups = target_groups_ui.value.map((group: SelectOption) => group.code)
        if(formatted_target_groups.length === 0) {
            show_error_toast('Invalid', 'Please select at least one group...')
            return;
        }

        const data_to_send: AddNumberToGroup = {
            number_id: numbers_id,
            groups: formatted_target_groups,
        }

        addNumberToGroup(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    emit('update:table')
                    show_success_toast('Success!', 'Numbers added!')
                } else {
                    show_error_toast('Error', 'Something failed while adding numbers...')
                }
            },
            onError: () => show_error_toast('Error', 'Something failed while adding numbers...')
        })
        reset_confirmation_modal_state()
    }

    /* ----- MOVE TO GROUP ----- */
    const handle_move_to_group = (numbers_id: SelectedNumberIds) => {
        const formatted_target_groups = target_groups_ui.value.map((group: SelectOption) => group.code)
        if(formatted_target_groups.length === 0) {
            show_error_toast('Invalid', 'Please select at least one group...')
            return;
        }
        
        const data_to_send: MoveNumberToGroup = {
            number_id: numbers_id,
            groups: formatted_target_groups,
            current_group_id: props.selectedGroups[0]
        }

        moveNumberToGroup(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    emit('update:table')
                    show_success_toast('Success!', 'Numbers moved!')
                } else {
                    show_error_toast('Oops...', 'Something failed while moving numbers...')
                }
            },
            onError: () => show_error_toast('Oops...', 'Something failed while moving numbers...')
        })
        reset_confirmation_modal_state()
    }

    /* ----- REMOVE FROM GROUP ----- */
    const handle_remove_from_group = (numbers_id: SelectedNumberIds) => {
        const data_to_send: RemoveNumberFromGroup = {
            number_ids: numbers_id.map((number) => number.number_id),
            group_id: props.selectedGroups[0]
        }

        removeNumberFromGroup(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    emit('update:table')
                    show_success_toast('Success!', data_to_send.number_ids.length > 1 ? 'Contacts removed!' : 'Contact removed!')
                } else {
                    show_error_toast('Error', 'Something went wrong while removing contact from group...')
                }
            },
            onError: () => show_error_toast('Error', 'Something went wrong while removing contact from group...')
        })
        current_action.value = ''
    }

    /* ----- SEND TO TRASH ----- */
    const handle_send_to_trash = (numbers_id: SelectedNumberIds) => {
        const data_to_send: SendNumberToTrash = {
            number_ids: numbers_id.map((number) => number.number_id)
        }

        sendNumberToTrash(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    emit('update:table')
                    show_success_toast('Success!', data_to_send.number_ids.length > 1 ? 'Numbers removed!' : 'Number removed!')
                } else {
                    show_error_toast('Oops...', 'Something went wrong...')
                }
            },
            onError: () => show_error_toast('Oops...', 'Something went wrong...')
        })
        current_action.value = ''
    }

    /* ----- RESTORE CONTACT ----- */
    const handle_restore_contact = (numbers_id: SelectedNumberIds) => {
        const data_to_send: NumberIdArray = {
            number_ids: numbers_id.map((number) => number.number_id)
        }

        restoreContact(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    emit('update:table')
                    show_success_toast('Success!', data_to_send.number_ids.length > 1 ? 'Contacts restored!' : 'Contact restored!')
                } else {
                    show_error_toast('Error', 'Something went wrong while restoring contact...')
                }
            },
            onError: () => show_error_toast('Error', 'Something went wrong while restoring contact...')
        })
        current_action.value = ''
    }

    /* ----- DELETE CONTACT FOREVER ----- */
    const handle_delete_contact = (numbers_id: SelectedNumberIds) => {
        const data_to_send: NumberIdArray = {
            number_ids: numbers_id.map((number) => number.number_id)
        }

        deleteContactForever(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    emit('update:table')
                    show_success_toast('Success!', data_to_send.number_ids.length > 1 ? 'Contacts deleted!' : 'Contact deleted!')
                } else {
                    show_error_toast('Error', 'Something went wrong while deleting contact...')
                }
            },
            onError: () => show_error_toast('Error', 'Something went wrong while deleting contact...')
        })
        current_action.value = ''
    }
</script>