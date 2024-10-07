<template>
    <Dialog v-model:visible="visible" modal header="Create new group" class="text-2xl font-semibold leading-8 w-full max-w-[800px]">        
        <div class="flex flex-col items-start gap-2 w-full">
            <label for="group-name" class="text-xl leading-6 text-left">Group
                Name*</label>
            <InputText id="group-name"
                class="flex w-full text-sm px-3 py-4 border border-gray-300 rounded-[30px] bg-white"
                autocomplete="off" placeholder="Enter Name" v-model="groupName" />
        </div>

        <div class="flex flex-col items-start gap-2 w-full">
            <label for="group-name" class="text-xl leading-6 text-left">Phone
                Launch ID</label>
            <InputText id="launch-id"
                class="flex w-full text-sm px-3 py-4 border border-gray-300 rounded-[30px] bg-white"
                autocomplete="off" placeholder="Enter a number ID" v-model="launchID" />
        </div>
        <span class="text-surface-500 dark:text-surface-400 block mb-8">*This information is mandatory
            to create a new group</span>
        <div class="flex justify-center mt-4">
            <Button type="button" label="Save" rounded
                class="flex justify-center items-center py-2 px-4 w-[300px]"
                @click="groupID ? editGroup(groupID) : save_new_group"
            </Button>
        </div>
        <div style="margin-top: 10px;">
            <span v-if="saveGroupContactsIsError" style="color: red;">Error: {{ saveGroupContactsError?.message
                }}</span>
            <span v-if="saveGroupContactsIsSuccess" style="color: green;">Group successfully created!</span>
        </div>
    </Dialog>
</template>

<script setup lang="ts">

const visible = ref(false);

const open = () => {
    visible.value = true;
    // const body = document.body;
    // body.style.overflow = 'hidden';
}
defineExpose({ open });

const groupName = ref('')
const launchID = ref<number | null>(null);
const groupID = ref<number | null>(null);

const emit = defineEmits(["editGroup"]);

const { mutate: saveGroupContacts, isPending: saveGroupContactsIsPending, isError: saveGroupContactsIsError, error: saveGroupContactsError, isSuccess: saveGroupContactsIsSuccess } = useSaveGroupContacts()

const save_new_group = () => {
    if (!groupName.value || !launchID.value) {
        alert('Group Name and Phone Launch ID are required.');
        return;
    }
    const dataToSend = {
        name: groupName.value,
        id: groupID.value ? parseInt(groupID.value, 10) : null,
        phone_launch_id: launchID.value ? parseInt(launchID.value, 10) : null
    }
    saveGroupContacts(dataToSend)
}


const editGroup = (groupId) => {
    console.log(groupID);
    // const dataToSend = {
    //     id: groupId,
    //     name: groupName.value,
    //     phone_launch_id: launchID.value ? parseInt(launchID.value, 10) : null
    // };
    // emit("funcionedit", dataToSend); // Emitir evento para editar el grupo
};
</script>
<style scoped>
/* @layer primevue {
    .p-dialog {
        max-height: 90%;
        transform: scale(1);
        border-radius: var(--p-dialog-border-radius);
        color: var(--p-dialog-color);
    }
}

@layer primevue {
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: background var(--p-button-transition-duration), color var(--p-button-transition-duration), border-color var(--p-button-transition-duration), outline-color var(--p-button-transition-duration), box-shadow var(--p-button-transition-duration);
        border-radius: var(--p-button-border-radius);
        outline-color: transparent;
        gap: var(--p-button-gap);
        padding: 2rem;
        background-color: transparent;
    }
} */
</style>
