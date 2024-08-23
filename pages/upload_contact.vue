<template>
    <div class="is-flex is-flex-direction-column is-align-items-center">
        <h2 class="has-text-primary has-text-weight-semibold mb-4">Upload Contacts</h2>

        <div class="card has-background-grey-dark has-text-white py-2 px-4" style="width: 50%;">
            <Toast />
            <FileUpload name="file[]" :url="`${BASE_API_URL()}${UPLOAD_CONTACT_CSV_URL}`" @upload="onAdvancedUpload($event)" :multiple="false" accept=".csv, .xlsx" :maxFileSize="200">
                <template #header="{ uploadCallback, files }">
                        <Button @click="uploadEvent(uploadCallback)" class="button is-primary" :class="[!files || files.length === 0 ? 'is-hidden' : 'is-block']">Upload</Button>
                </template>

                <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                    <div v-if="files.length > 0">
                        <div>
                            <div v-for="(file, index) of files" :key="file.name + file.type + file.size">
                                <span class="has-text-weight-semibold">{{ file.name }}</span>
                                <div>{{ formatSize(file.size) }}</div>
                                <Button @click="onRemoveTemplatingFile(file, removeFileCallback, index)" class="button is-danger">X</Button>
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
            <!-- <FileUpload name="file[]" :url="`${BASE_API_URL()}${UPLOAD_CONTACT_CSV_URL}`" @upload="onAdvancedUpload($event)" :multiple="false" accept=".csv, .xlsx" :maxFileSize="200">
                <template #empty>
                    <span>Drag and drop files to here to upload.</span>
                </template>
            </FileUpload> -->
        </div>
    </div>
</template>

<script setup lang="ts">
    const toast = useToast();
    const primevue = usePrimeVue();

    const totalSize = ref(0);
    const totalSizePercent = ref(0);
    const files = ref([]);

    const { mutate: uploadContact } = useUploadContacts();

    const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
        removeFileCallback(index);
        totalSize.value -= parseInt(formatSize(file.size));
        totalSizePercent.value = totalSize.value / 10;
    };

    const onTemplatedUpload = () => {
        toast.add({ severity: "primary", summary: "Success", detail: "File Uploaded", life: 3000 });
    };

    const onAdvancedUpload = (event) => {
        toast.add({ severity: "primary", summary: "Success", detail: "File Uploaded", life: 3000 });
        console.log(JSON.parse(event.xhr.response));
    };


    const uploadEvent = (callback: ()=>void) => {
        callback()
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