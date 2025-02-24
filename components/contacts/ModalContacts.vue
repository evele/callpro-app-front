<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4 contacts-modal">
        <template #header>
            <header class="w-full flex items-center justify-between px-8 border-b pb-6">
                <PopoverOption :options="menuOptions" :selected-option="selected_option" @optionSelected="handleOptionSelected" />
                <Button @click="close" class="bg-transparent border-none  px-2 text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
        </template>

        <SaveContact v-if="section_to_show === CONTACT" 
            :selected-contact="selectedContact" 
            @close="handleClose" 
            @success="handleSuccess" 
            @error="handleError"
            @update:table="emit('update:table')"
        />

        <DNCContacts v-if="section_to_show === DNC" @close="close" @success="handleSuccess" @error="handleError" />

        <SaveCustomGroups v-if="section_to_show === NEW_GROUP" :group-to-edit="group_to_edit" 
            @close="handleClose" @success="handleSuccess" @error="handleError" 
        />

        <UploadContacts v-if="section_to_show === UPLOAD" :selected-group="selectedGroup" 
            @close="handleClose" @success="handleSuccess" @error="handleError" @changeTitle="handleChangeTitle" 
        />

        <template #footer />
    </Dialog>
</template>

<script setup lang="ts">
    const props = defineProps({
        selectedGroup: { type: String, required: true },
        groupToEdit: { type: Object, required: false, default: null },
        selectedContact: { type: Object as PropType<ContactToEdit | null>, required: false, default: null }
    })

    const group_to_edit = ref()
    const visible = ref(false)
    const emit = defineEmits(['reset', 'update:table'])

    const section_to_show = ref<ContactsModalSectionToShow>('')
    const selected_option = ref('')
    const upload_title = ref('Upload new file')
    const contact_title = computed(() => props.selectedContact ? 'Edit contact' : 'Add new contact')
    const group_title = computed(() => props.groupToEdit.groupID ? 'Edit group' : 'Add new group')

    const menuOptions = computed(() => [
        { id: CONTACT, text: contact_title.value },
        { id: NEW_GROUP, text: group_title.value },
        { id: DNC, text: "Add new DNC" },
        { id: UPLOAD, text: upload_title.value },
    ]);

    const handleOptionSelected = (selectedOption: ContactsModalSectionToShow) => {
        selected_option.value = selectedOption
        section_to_show.value = selectedOption
        emit('reset', true)

        if(upload_title.value !== 'Upload new file') {
            upload_title.value = 'Upload new file';
        }

        if(selectedOption === NEW_GROUP) {
            group_to_edit.value = null;
        }
    };

    const open = (section: ContactsModalSectionToShow) => {
        section_to_show.value = section
        selected_option.value = section
        group_to_edit.value = props.groupToEdit
        visible.value = true;
    }

    const close = () => {
        section_to_show.value = '';
        selected_option.value = ''
        emit('reset', true)
        visible.value = false;
    }

    defineExpose({ open });

    const { show_success_toast, show_error_toast, show_info_toast } = usePrimeVueToast();

    const handleClose = () => close()

    const handleSuccess = (message: string) => show_success_toast('Success', message)

    const handleError = (error: string) => show_error_toast('Error', error)

    const handleInfo = (info: string) => show_info_toast('Notice', info)

    const handleChangeTitle = (title: string) => upload_title.value = title
</script>