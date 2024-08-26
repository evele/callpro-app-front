<template>
    <div class="is-flex is-flex-direction-column is-align-items-center">
        <h2 class="has-text-primary has-text-weight-semibold mb-4">Upload Contacts</h2>

        <p v-if="CGIsError" style="color: red;">Custom groups fetch failed D:</p>
                <div v-if="CGIsSuccess" class="div-style">
                    <label>Choose group</label>
                    <span style="color: red;" v-if="!userCustomGroups.result">Custom groups fetch failed D:</span>
                    <select v-else v-model="selectedGroup">
                        <option v-if="!userCustomGroups.custom_groups.length" :value="null">No results found.</option>
                        <option value="all">All</option>
                        <option value="unassigned">Unassigned</option>
                        <option value="trash">Trash</option>
                        <option v-if="userCustomGroups.custom_groups.length" v-for="group in userCustomGroups.custom_groups" :value="group.id">{{ group.group_name }}</option>
                    </select>
                </div>

        <div class="card has-background-grey-dark has-text-white py-2 px-4" style="width: 50%;">
            <Toast />
            <FileUpload name="file" @upload="onAdvancedUpload($event)" :multiple="false" accept=".csv, .xlsx, .xls" :maxFileSize="200000">
                <template #header="{ files }">
                        <Button @click="uploadEvent(files)" class="button is-primary" :class="[!files || files.length === 0 ? 'is-hidden' : 'is-block']">Upload</Button>
                </template>

                <template #content="{ files, uploadedFiles, removeFileCallback }">
                    <div v-if="files.length > 0">
                        <div>
                            <div v-for="(file, index) of files" :key="file.name + file.type + file.size">
                                <span class="has-text-weight-semibold">{{ file.name }}</span>
                                <div>{{ formatSize(file.size) }}</div>
                                <Button @click="onRemoveTemplatingFile(removeFileCallback, index)" class="button is-danger">X</Button>
                            </div>
                        </div>
                    </div>

                    <div v-if="uploadedFiles.length > 0">
                        <h5 style="color: green">Success!</h5>
                    </div>
                </template>

                <template #empty>
                    <div class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column p-2" style="border: 2px dotted white; border-radius: 8px;">
                        <i class="is-size-3 has-background-grey-light has-text-black has-text-weight-semibold" style="border-radius: 100%; padding:2rem 24px;">Drop</i>
                        <p>Drag and drop files to here to upload.</p>
                    </div>
                </template>
            </FileUpload>
        </div>
    </div>
</template>

<script setup lang="ts">
    const toast = useToast();
    const primevue = usePrimeVue();

    const selectedGroup: Ref<SelectOption['name']> = ref('all');

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()
    const { mutate: uploadContact } = useUploadContacts();

    const onRemoveTemplatingFile = (removeFileCallback, index) => {
        removeFileCallback(index);
    };

    const onTemplatedUpload = () => {
        toast.add({ severity: "primary", summary: "Success", detail: "File Uploaded", life: 3000 });
    };

    const onAdvancedUpload = (event) => {
        toast.add({ severity: "primary", summary: "Success", detail: "File Uploaded", life: 3000 });
        console.log(JSON.parse(event.xhr.response));
    };


    const uploadEvent = (file) => {
        const uploadedContact = new FormData();

        uploadedContact.append('file', file[0]);
        uploadedContact.append('from_broadcast', 'false');
        uploadedContact.append('save_contact', 'true');
        uploadedContact.append('group_id', selectedGroup.value);

        uploadContact(uploadedContact);
    };

    const formatSize = (bytes: number) => {
        const k = 1024;
        const dm = 3;
        const sizes = primevue.config.locale.fileSizeTypes;

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
    };
</script>