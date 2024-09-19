<template>
    <div class="is-flex is-flex-direction-column is-align-items-center">
        <h2 class="has-text-primary has-text-weight-semibold mb-4">Upload Contacts</h2>

        <p v-if="CGIsError" style="color: red;">Custom groups fetch failed D:</p>
        <div v-if="CGIsSuccess" class="div-style">
            <label>Choose group</label>
            <span style="color: red;" v-if="!userCustomGroups?.result">Custom groups fetch failed D:</span>
            <select v-else v-model="selectedGroup">
                <option v-if="!userCustomGroups?.custom_groups?.length" :value="null">No results found.</option>
                <option value="all">All</option>
                <option value="unassigned">Unassigned</option>
                <option value="trash">Trash</option>
                <option v-if="userCustomGroups?.custom_groups?.length" v-for="group in userCustomGroups?.custom_groups" :value="group?.id">{{ group?.group_name }}</option>
            </select>
        </div>

        <Button label="Upload a file" @click="open_modal" />

        <ModalUploadContacts ref="modalUploadContacts" :selected-group="selectedGroup" />
    </div>
</template>

<script setup lang="ts">
    const selectedGroup: Ref<SelectOption['name']> = ref('all');
    const modalUploadContacts = ref()

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()

    const open_modal = () => {
        modalUploadContacts.value.open();
    }
</script>
