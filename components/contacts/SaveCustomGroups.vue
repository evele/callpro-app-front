<template>
    <div class="flex flex-col gap-[38px]">
        <div class="flex flex-col gap-2 w-full">
            <label for="group-name" class="leading-6 text-left text-dark-3">Group Name*</label>
            <InputText id="group-name" class="w-full text-sm border border-gray-300 bg-white" autocomplete="off"
                placeholder="Enter Name" v-model="groupName" 
            />
        </div>

        <div class="flex flex-col gap-2 w-full">
            <label for="group-name" class="leading-6 text-left text-dark-3">Phone Launch ID</label>
            <InputText id="launch-id" class="w-full text-sm border border-gray-300 bg-white" autocomplete="off"
                placeholder="Enter a number ID" v-model="launchIDString" 
            />
        </div>
        <span class="text-xs">*This information is mandatory to create a new group</span>
        <Button type="button" class="justify-center items-center w-[300px] mx-auto" :disabled="isPending" @click="save_new_group">
            {{ isPending ? 'Saving...' : 'Save' }}
        </Button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    groupToEdit: {
        type: Object,
        required: false,
        default: null
    }
})

const { mutate: saveGroupContacts, isPending } = useSaveGroupContacts()

const emit = defineEmits(['close', 'success', 'error'])

const groupName = ref('')
const launchID = ref<number | null>(null);
const groupID = ref<number | null>(null);

const launchIDString = computed({ //TODO: CHECK THIS, IT SHOULD BE A NUMBER
    get: () => launchID.value !== null ? launchID.value.toString() : '',
    set: (value: string) => {
        launchID.value = value ? parseInt(value, 10) : null;
    },
});

onMounted(() => {
    if (props.groupToEdit) {
        groupName.value = props.groupToEdit.groupName,
        launchID.value = props.groupToEdit.launchID,
        groupID.value = props.groupToEdit.groupID
    }
})

const save_new_group = () => {
    if (!groupName.value) {
        emit('error', 'Group Name is required.')
        return;
    }
    const dataToSend: ContactGroup = {
        name: groupName.value,
        id: groupID.value ? parseInt(groupID.value.toString(), 10) : null,
        phone_launch_id: launchID.value ? parseInt(launchID.value.toString(), 10) : null
    }

    saveGroupContacts(dataToSend, {
        onSuccess: () => {
            emit('success', 'Group saved successfully')
            emit('close')
        },
        onError: () => {
            emit('error', 'Error saving group')
        }
    })
}
</script>
