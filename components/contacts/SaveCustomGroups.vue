<template>
    <!-- TODO: text 2xl 3xl dont' function -->
    <Dialog v-model:visible="visible" modal header="Create new group"
        class="text-2xl w-full max-w-[850px] ">
        <Divider class="max-w-[850px] mb-[38px]" />

        <div class="flex flex-col items-start gap-2 w-full mb-[38px]">
            <label for="group-name" class="text-xl leading-6 text-left">Group
                Name*</label>
            <InputText id="group-name"
                class="flex w-full text-sm px-3 py-4 border border-gray-300 rounded-[30px] bg-white" autocomplete="off"
                placeholder="Enter Name" v-model="groupName" />
        </div>

        <div class="flex flex-col items-start gap-2 w-full mb-[38px]">
            <label for="group-name" class="text-xl leading-6 text-left">Phone
                Launch ID</label>
            <InputText id="launch-id"
                class="flex w-full text-sm px-3 py-4 border border-gray-300 rounded-[30px] bg-white" autocomplete="off"
                placeholder="Enter a number ID" v-model="launchIDString" />
        </div>

        <span class="text-xs">*This information is mandatory
            to create a new group</span>
        
        <template #footer>
            <Button type="button" class="flex justify-center items-center py-2 px-4 w-[300px] mx-auto m-[28px]"
            :disabled="props.isPending" @click="save_new_group" >
                {{ props.isPending ? 'Saving...' : 'Save' }}
            </Button>
        </template>
        <div style="margin-top: 10px;">
            <span v-if="props.isError" style="color: red;">Error: {{ props.errorMessage
                }}</span>
            <span v-if="props.isSuccess" style="color: green;">Group successfully created!</span>
        </div>
    </Dialog>
</template>

<script setup lang="ts">


const props = defineProps({
    selectedGroup: {
        type: Object,
        required: false,
        default: null
    },
    isPending: {
        type: Boolean,
        default: false
    },
    isError: {
        type: Boolean,
        default: false
    },
    errorMessage: {
        type: String,
        default: ''
    },
    isSuccess: {
        type: Boolean,
        default: false
    }
})

const visible = ref(false);

const groupName = ref('')
const launchID = ref<number | null>(null);
const groupID = ref<number | null>(null);

const launchIDString = computed({
    get: () => launchID.value !== null ? launchID.value.toString() : '',
    set: (value: string) => {
        launchID.value = value ? parseInt(value, 10) : null;
    },
});

const open = () => {
    visible.value = true;
    if (props.selectedGroup) {
        groupName.value = props.selectedGroup.groupName,
            launchID.value = props.selectedGroup.launchID,
            groupID.value = props.selectedGroup.groupID
    }
}


const emit = defineEmits(['update:saveGroup'])

const save_new_group = () => {
    console.log(props.selectedGroup)
    console.log("save new group")
    if (!groupName.value || !launchID.value) {
        alert('Group Name and Phone Launch ID are required.');
        return;
    }
    const dataToSend = {
        name: groupName.value,
        id: groupID.value ? parseInt(groupID.value.toString(), 10) : null,
        phone_launch_id: launchID.value ? parseInt(launchID.value.toString(), 10) : null


    }
    emit('update:saveGroup', dataToSend);
}


defineExpose({ open });
</script>
<style scoped></style>
