<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4 contacts-modal">
        <template #header>
            <header class="w-full flex items-center justify-between px-8 border-b pb-6">
                <PopoverOption :options="menuOptions" :selected-option="selected_option" @optionSelected="handleOptionSelected" />
                <Button @click="close" class="bg-transparent border-none  px-2 text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
        </template>

        <AddNewContact v-if="section_to_show === 'contact'" 
            :selected-contact="selected_contact" 
            @close="handleClose" 
            @success="handleSuccess" 
            @error="handleError"
            @update:table="emit('update:table')"
        />

        <DNCContacts v-if="section_to_show === 'dnc'" @close="close" @success="handleSuccess"
            @error="handleError" @updateMessage="handleUpdateMessage" 
        />

        <SaveCustomGroups v-if="section_to_show === 'new_group'" :group-to-edit="group_to_edit" 
            @close="handleClose" @success="handleSuccess" @error="handleError" 
        />

        <UploadContacts v-if="section_to_show === 'upload'" :selected-group="selectedGroup" 
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
    const selected_contact = computed(() => props.selectedContact)
    const visible = ref(false)

    const emit = defineEmits(['updateMessage', 'reset', 'update:table'])

    const section_to_show = ref<ContactsModalSectionToShow>('')
    const selected_option = ref('')
    const upload_title = ref('Upload new file')
    const contact_title = computed(() => selected_contact.value ? 'Edit contact' : 'Add new contact')

    const menuOptions = computed(() => [
        { id: 'contact', text: contact_title.value },
        { id: 'new_group', text: "Add new Group" }, // TODO: check about edit group
        { id: 'dnc', text: "Add new DNC" },
        { id: 'upload', text: upload_title.value },
    ]);

    const handleOptionSelected = (selectedOption: ContactsModalSectionToShow) => {
        selected_option.value = selectedOption
        section_to_show.value = selectedOption
        emit('reset', true)

        if(upload_title.value !== 'Upload new file') {
            upload_title.value = 'Upload new file';
        }

        if(selectedOption === 'new_group') {
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

    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const handleClose = () => close()

    const handleSuccess = (message: string) => show_success_toast('Success', message)

    const handleError = (error: string) => show_error_toast('Error', error)

    const handleChangeTitle = (title: string) => upload_title.value = title

    const handleUpdateMessage = (message: string) => emit('updateMessage', message)
</script>