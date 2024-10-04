<template>

    <Dialog v-model:visible="visible" modal header="Create New Group" :style="{ width: '25rem' }">
        <div class="flex flex-col items-start gap-2 w-[786px] h-[73px]">
            <label for="group-name" class="font-normal text-[19.55px] leading-[27.37px] text-left">Group
                Name*</label>
            <InputText id="group-name"
                class="flex w-[786px] min-w-[293.25px] h-[38px] p-[12px_16px] border border-gray-300 rounded-[30px] bg-white"
                autocomplete="off" placeholder="Enter Name" v-model="groupName" />
        </div>

        <div class="flex flex-col items-start gap-2 w-[786px] h-[73px]">
            <label for="group-name" class="font-normal text-[19.55px] leading-[27.37px] text-left">Phone
                Launch ID</label>
            <InputText id="launch-id"
                class="flex w-[786px] min-w-[293.25px] h-[38px] p-[12px_16px] border border-gray-300 rounded-[30px] bg-white"
                autocomplete="off" placeholder="Enter a number ID" v-model="launchID" />
        </div>
        <span class="text-surface-500 dark:text-surface-400 block mb-8">*This information is mandatory
            to create a new group</span>
        <div class="flex justify-center mt-4">
            <Button type="button" label="Save"
                class="flex justify-center items-center py-2 px-4 w-[300px] h-[40px] rounded-[30px]"
                @click="save_new_group">
            </Button>+            
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
/*

<div class="new-group-container">
        <h2>Create New Group</h2>
        <div class="form-group">
            <label for="group_name">Group Name:</label>
            <input type="text" id="group_name" v-model="groupName" placeholder="Enter group name" />
        </div>
        <div class="form-group">
            <label for="launch_id">Phone Launch ID:</label>
            <input type="number" id="launch_id" v-model="launchID" min="1" placeholder="Enter Phone Launch ID" />
            <input type="number" id="group_id" v-model="groupID" placeholder="Enter Group ID" />
        </div>
        <button @click="save_new_group">{{ !saveGroupContactsIsPending ? 'Save new group' : 'Saving...' }}</button>
         <div style="margin-top: 10px;">
            <span v-if="saveGroupContactsIsError" style="color: red;">Error: {{ saveGroupContactsError?.message }}</span>
            <span v-if="saveGroupContactsIsSuccess" style="color: green;">Contact group successfully updated!</span>
        </div>
    </div>

    - cambiar nombre input id.
    - capturar input groupName = ref('') const launchID = ref('')

*/

const groupName = ref('')
const launchID = ref<number | null>(null);
const groupID = ref<number | null>(null);

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
