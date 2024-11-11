<template>
    <Dialog v-model:visible="visible" modal :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex items-center justify-between px-8 border-b pb-6">
                <PopoverOption :options="menuOptions" :selected-option="selected_option" @optionSelected="handleOptionSelected" />
                <Button @click="close" class="bg-transparent border-none  px-2 text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
        </template>

        <AddNewContact v-if="section_to_show === 'new_contact'" />
        <DNCContacts v-if="section_to_show === 'dnc'" @close="close" />
        <SaveCustomGroups v-if="section_to_show === 'new_group'" @update:saveGroup="handlerSaveGroup"
            :selected-group="selectedGroup" :is-pending="saveGroupContactsIsPending" 
        />

        <template #footer />
    </Dialog>
</template>

<script setup lang="ts">
    const visible = ref(false);

    type SectionToShow = '' | 'new_contact' | 'new_group' | 'dnc';
    const section_to_show = ref<SectionToShow>('');
    const selected_option = ref('')

    const menuOptions = ref([
        { id: 'new_contact', text: "Add new contact" },
        { id: 'new_group', text: "Add new Group" },
        { id: 'dnc', text: "Add new DNC" },
    ]);

    const handleOptionSelected = (selectedOption: string) => {
        selected_option.value = selectedOption
        section_to_show.value = selectedOption;
    };

     const open = (section: string) => {
        section_to_show.value = section;
        selected_option.value = section
        visible.value = true;
    }

    const close = () => {
        section_to_show.value = '';
        selected_option.value = ''
        visible.value = false;
    }

    defineExpose({ open });
</script>