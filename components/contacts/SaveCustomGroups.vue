<template>
    <div class="flex flex-col gap-[38px] mt-9">
        <div class="gap-2 w-full ">
            <label for="group-name" class="text-xl leading-6 text-left">Group Name*</label>
            <InputText id="group-name" class="w-full text-sm border border-gray-300 bg-white" autocomplete="off"
                placeholder="Enter Name" v-model="groupName" 
            />
        </div>

        <div class="gap-2 w-full ">
            <label for="group-name" class="text-xl leading-6 text-left">Phone Launch ID</label>
            <InputText id="launch-id" class="w-full text-sm border border-gray-300 bg-white" autocomplete="off"
                placeholder="Enter a number ID" v-model="launchIDString" 
            />
        </div>
        <span class="text-xs">*This information is mandatory to create a new group</span>
    </div>

    <Button type="button" class="justify-center items-center w-[300px] mx-auto" :disabled="props.isPending" @click="save_new_group">
        {{ isPending ? 'Saving...' : 'Save' }}
    </Button>
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
    }
})

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
    if (props.selectedGroup) {
        groupName.value = props.selectedGroup.groupName,
        launchID.value = props.selectedGroup.launchID,
        groupID.value = props.selectedGroup.groupID
    }
}

const emit = defineEmits(['update:saveGroup','update:selectedGroup'])

const save_new_group = () => {
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
    setTimeout(() => {
        close();
    }, 2000);
}
</script>
