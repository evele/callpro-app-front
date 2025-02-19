<template>
    <section class="container flex flex-col">
        <div>
            <h4 class="groups-title">System Groups</h4>

            <ul class="mt-3 flex flex-col default-groups-ul">
                <li v-for="button in defaultGroupsButtons" :key="button.group_id">
                    <GroupButton :group-name="button.text" :contacts-count="button.value"
                        :active="active_buttons.includes(button.group_id)" @click="setActiveButton(button.text, button.group_id)">
                        <template #icon>
                            <component :is="button.icon" :alt="button.text" />
                        </template>
                    </GroupButton>
                </li>
            </ul>
        </div>

        <Divider class="my-0 divider" />

        <div class="flex flex-col">
            <h4 class="groups-title">My Groups</h4>
            <ul class="user-group-container mt-4 flex flex-col">
                <li v-if="isLoadingCG">Loading...</li>
                <li v-if="isErrorCG">Error loading groups.</li>
                <li class="flex justify-end" v-for="group in isSuccessCG && CGData?.result ? CGData.custom_groups : []"
                    :key="group.id">

                    <Button class="user-group-btn flex justify-between items-center" @click="setActiveButton(group.group_name, group.id)"
                        :class="[ active_buttons.includes(group.id) ? 'bg-[#d8cbeb]' : 'bg-[#EADDFF]']"
                    >
                        <div class="flex items-center user-group-data text-left">
                            <p class="max-w-[80px] truncate">{{ group.group_name }}</p>
                            <span class="contacts-count leading-none">{{ group.count }}</span>
                        </div>

                        <div class="flex gap-1">
                            <Button 
                                class="bg-white p-0 h-4 w-4 text-dark-3 border border-grey-14 hover:bg-gray-200"
                                @click.stop="openEditDialog(group)"
                            >
                                <EditIconSVG class="w-[10px] h-[10px]" />
                            </Button>
                            <Button 
                                class="bg-white p-0 h-4 w-4 text-dark-3 border border-grey-14 hover:bg-gray-200"
                                @click.stop="handleDeleteGroup(group.id)"
                            >
                                <TrashSVG class="w-3 h-3" />
                            </Button>
                        </div>
                    </Button>
                </li>
            </ul>
        </div>
    </section>

    <ModalContacts ref="modalContacts" :selected-group="selectedGroups[0].group_id" :group-to-edit="selected_group_to_edit" />

    <ConfirmationModal 
        ref="confirmationModal" 
        title="Delete Group" 
        :is-disabled="isDeletingGroup" 
        :close-on-confirm="false" 
        :is-loading="isDeletingGroup" 
        :loading-text="'Deleting...'"
        @confirm="handle_confirm_modal" 
        @cancel="handle_cancel_modal"
    >
        <div class="flex flex-col gap-4">
            <p class="text-lg font-semibold">Are you sure you want to delete this group?</p>
            <div class="flex items-center gap-2">
                <Checkbox v-model="numbers_to_trash_checkbox" inputId="trashCheckbox" binary />
                <label for="trashCheckbox" class="text-pending font-medium">Also send numbers in this group to trash</label>
            </div>
            <Message severity="error" class="mb-1"><span class="font-bold">Warning:</span> This action can not be undone!</Message>
        </div>
    </ConfirmationModal>
</template>

<script setup lang="ts">
import EditIconSVG from "@/components/svgs/EditIconSVG.vue"
import AllSVG from "@/components/svgs/AllSVG.vue";
import UnassginedSVG from "@/components/svgs/UnassignedSVG.vue";
import TrashSVG from "@/components/svgs/TrashSVG.vue";

const props = defineProps({
    selectedGroups: { type: Array as PropType<ContactSelectedGroup[]>, required: true, default: [] },
})

const emit = defineEmits(['selectedGroup', 'update:table'])

const defaultGroupsButtons = [
    { text: 'ALL', value: Math.floor(Math.random() * 100), icon: AllSVG, group_id: CONTACTS_ALL },
    { text: 'Unassigned', value: Math.floor(Math.random() * 100), icon: UnassginedSVG, group_id: UNASSIGNED },
    { text: 'Trash', value: Math.floor(Math.random() * 100), icon: TrashSVG, group_id: TRASH }
];

const active_buttons = computed(() => props.selectedGroups.map((group: ContactSelectedGroup) => group.group_id))

const setActiveButton = (button_name: string, button_group_id: string) => {
    const is_custom = !defaultGroupsButtons.some(button => button.group_id === button_group_id)

    emit('selectedGroup', button_name, button_group_id, is_custom);
};

const { data: CGData, isLoading: isLoadingCG, isSuccess: isSuccessCG, isError: isErrorCG } = useFetchGetCustomGroups()
const { mutate: deleteGroup, isPending: isDeletingGroup, } = useDeleteUserGroup()

const custom_groups = computed(() => {
    if(!CGData?.value?.result) return []
    return CGData?.value.custom_groups
})

const { show_success_toast, show_error_toast } = usePrimeVueToast();

const modalContacts = ref();

const selected_group_to_edit = reactive({
    groupID: '',
    groupName: '',
    launchID: ''
})

const openEditDialog = (group: CustomGroup) => {
    Object.assign(selected_group_to_edit, {
        groupID: group.id,
        groupName: group.group_name,
        launchID: group.group_code
    });
    modalContacts.value.open('new_group')
};

const confirmationModal = ref()
const numbers_to_trash_checkbox = ref(false)
const group_to_delete = ref('')

const handleDeleteGroup = (group_id: string) => {
    group_to_delete.value = group_id
    confirmationModal.value?.open()
};

const handle_confirm_modal = () => {
    const user_groups = custom_groups.value
    const rest_of_user_groups = user_groups.map((group: CustomGroup) => group.id)

    const data_to_send: GroupToDelete = {
        group_id: group_to_delete.value,
        numbers_to_trash: numbers_to_trash_checkbox.value,
        rest_of_user_groups
    }

    deleteGroup(data_to_send, {
        onSuccess: (response: APIResponseSuccess | APIResponseError) => {
            if(response.result) {
                show_success_toast('Success!', 'Group deleted successfully.')
                emit('update:table')
                confirmationModal.value?.close()
                numbers_to_trash_checkbox.value = false
                group_to_delete.value = ''
                setActiveButton('All', CONTACTS_ALL)
            } else {
                show_error_toast('Error', 'Something went wrong, please try again.')
            }
        },
        onError: () => {
            show_error_toast('Error', 'Something went wrong, please try again.')
        }
    })
};

const handle_cancel_modal = () => {
    group_to_delete.value = ''
    numbers_to_trash_checkbox.value = false
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    min-width: 220px;
    border-radius: 16px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    background-color: #FFF;
    gap: 12px;
    justify-content: space-between;
    padding: 20px 16px;

    .divider {
        background: #CAC4D0;
        height: 0.5px;
    }

    .contacts-count {
        margin-left: 6px;
        color: #79747E;
        font-size: 11px;
    }
}

.groups-title {
    color: #89a43d;
    font-size: 18px;
    font-weight: 600;
    line-height: 140%;
}

.default-groups-ul {
    gap: 6px;
    list-style: none;
    padding: 0;
    text-align: end;
}

.fake-button {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    background-color: #F4F0EF;
}

.user-group-container {
    overflow-y: auto;
    gap: 5px;
    padding: 0;
    flex: 1 1 auto;
    min-height: 150px;
    max-height: calc(100vh - 743px);
}

.user-group-btn {
    width: 94%;
    border-radius: 10px;
    height: 35px;
    border: none;
    padding: 10px 12px;

    .user-group-data {
        font-size: 14px;
        font-weight: 500;
        color: #1D192B;

        .user-group-number {
            color: #79747E;
            font-size: 12px;
            font-style: italic;
            font-weight: 400;
        }
    }
}

.bg-green {
    background-color: #EBFFEE;
}

.bg-yellow {
    background-color: #FFFBEB;
}

.bg-red {
    background-color: #FEE9E7;
}

.add-new-btn {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    color: #FFF;
    width: 180px;
    height: 45px;
    padding: 10px 0;
    margin-top: 10px;
    gap: 8px;
    border-radius: 18px;
    background-color: #1D192B;
    box-shadow: 0px 0.9px 1.8px 0px rgba(0, 0, 0, 0.30), 0px 1.8px 5.4px 1.8px rgba(0, 0, 0, 0.15);

    &:hover {
        cursor: pointer;
    }

    .plus-icon {
        position: absolute;
        left: 40%;
        top: 50%;
        transform: translateY(-50%);
        transition: left 0.3s ease;
    }

    .add-new-text {
        position: absolute;
        min-width: 80px;
        left: 50%;
        opacity: 0;
        transition: left 0.3s ease, opacity 0.3s ease;
    }

    &:hover .plus-icon {
        left: 20%;
    }

    &:hover .add-new-text {
        left: 37%;
        opacity: 1;
    }
}
</style>