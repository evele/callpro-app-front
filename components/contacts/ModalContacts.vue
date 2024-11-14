<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4 contacts-modal">
        <template #header>
            <header class="w-full flex items-center justify-between px-8 border-b pb-6">
                <PopoverOption :options="menuOptions" :selected-option="selected_option" @optionSelected="handleOptionSelected" />
                <Button @click="close" class="bg-transparent border-none  px-2 text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
        </template>

        <AddNewContact v-if="section_to_show === 'new_contact'" @close="handleClose" @success="handleSuccess" @error="handleError" />

        <DNCContacts v-if="section_to_show === 'dnc'" @close="close" @success="handleSuccess"
            @error="handleError" @updateMessage="handleUpdateMessage" 
        />

        <SaveCustomGroups v-if="section_to_show === 'new_group'" :selected-group="selected_group" 
            @close="handleClose" @success="handleSuccess" @error="handleError" 
        />

        <UploadContacts v-if="section_to_show === 'upload'" :selected-tab="selectedTab" 
            @close="handleClose" @success="handleSuccess" @error="handleError" @changeTitle="handleChangeTitle" 
        />

        <template #footer />
    </Dialog>
</template>

<script setup lang="ts">
    const props = defineProps({
        selectedTab: { type: String, required: true },
        selectedGroup: { type: Object, required: false, default: null }
    })

    const selected_group = ref()
    const visible = ref(false)

    const emit = defineEmits(['updateMessage'])

    const section_to_show = ref<SectionToShow>('')
    const selected_option = ref('')
    const upload_title = ref('Upload new file')

    const menuOptions = computed(() => [
        { id: 'new_contact', text: "Add new contact" },
        { id: 'new_group', text: "Add new Group" },
        { id: 'dnc', text: "Add new DNC" },
        { id: 'upload', text: upload_title.value },
    ]);

    const handleOptionSelected = (selectedOption: SectionToShow) => {
        selected_option.value = selectedOption
        section_to_show.value = selectedOption

        if(upload_title.value !== 'Upload new file') {
            upload_title.value = 'Upload new file';
        }

        if(selectedOption === 'new_group') {
            selected_group.value = null;
        }
    };

     const open = (section: SectionToShow) => {
        section_to_show.value = section
        selected_option.value = section
        selected_group.value = props.selectedGroup
        visible.value = true;
    }

    const close = () => {
        section_to_show.value = '';
        selected_option.value = ''
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