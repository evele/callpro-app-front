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

        <div class="card has-background-grey-dark has-text-white py-2 px-4" style="width: 50%;">
            <Toast />
            <FileUpload name="file" :multiple="false" accept=".csv, .xlsx, .xls" :maxFileSize="200000" @select="onSelectedFiles">
                <template #header="{ files }">
                        <Button @click="uploadEvent(files)" class="button is-primary" :class="[!files || files.length !== 1 ? 'is-hidden' : 'is-block']">Upload</Button>
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

        <section v-if="uploadedSuccess && uploadedData?.result">
            <div v-if="uploadedData?.contacts?.length">
                <h3 class="has-text-primary has-text-weight-semibold mb-2">Contact(s) to save:</h3>
                <div v-for="contact in uploadedData.contacts" :key="contact.numbers[0].number" style="margin-bottom: 1rem;">
                    <p class="has-text-primary">First name: {{ contact.first_name }}</p>
                    <p class="has-text-primary">Last name: {{ contact.last_name }}</p>
                    <p class="has-text-primary" v-for="number in contact.numbers" :key="number.number">
                        Number: {{ number?.number }}
                    </p>
                </div>
            </div>

            <button class="button is-primary" @click="save_contact">Save Contact</button>

            <p style="color: green;" v-if="savedSuccess && savedData?.result">Contact saved!</p>
        </section>
    </div>
</template>

<script setup lang="ts">
    const selectedGroup: Ref<SelectOption['name']> = ref('all');

    const group_id = ref('');
    const contacts: Ref<uploadedContactToSave[]> = ref([]);

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()
    const { mutate: uploadContact, isSuccess: uploadedSuccess, data: uploadedData } = useUploadContact();
    const { mutate: saveUploadedContact, isSuccess: savedSuccess, data: savedData } = useSaveUploadedContact();

    const onRemoveTemplatingFile = (removeFileCallback: (index: number) => void, index: number) => {
        removeFileCallback(index);
    }


    type UploadContactData = {
        file: File;
        from_broadcast: string;
        save_contact: string;
        group_id: string;
    };

    type FileUploadEvent = {
        originalEvent: Event;
        files: File[]
    }

    // Did this to help ts understand the data
    const createFormData = (data: UploadContactData): FormData => {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('from_broadcast', data.from_broadcast);
        formData.append('save_contact', data.save_contact);
        formData.append('group_id', data.group_id);
        return formData;
    };

    const onSelectedFiles = (files: FileUploadEvent) => {
        if(files.files.length > 1) {
            files.files.shift();
        }
    };

    const uploadEvent = (file: File[]) => {
        contacts.value = [];

        const data: UploadContactData = {
            file: file[0],
            from_broadcast: 'false',
            save_contact: 'true',
            group_id: selectedGroup.value
        };

        const data_to_send = createFormData(data);

        uploadContact(data_to_send, {
            onSuccess: (data: UploadContactAPIResponse) => {
                if(data.result && data.contacts?.length) {
                    data.contacts.forEach((contact, i) => {
                        contact.numbers.forEach(number => {
                            contacts.value.push({
                                first_name: contact.first_name,
                                last_name: contact.last_name,
                                number: number.number,
                                contact_id: `fake-${i+1}`
                            });
                        });
                    })
                    group_id.value = data.group_id || 'all';
                }
            }
        });
    };

    const formatSize = (bytes: number) => {
        const k = 1024;
        const dm = 3;
        const sizes = ['B', 'KB', 'MB'];

        if (bytes === 0) {
            return '0 B';
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
    };

    const save_contact = () => {
        const data_to_send: uploadedContactToSaveData = {
            contacts: contacts.value,
            group_id: group_id.value
        }

        saveUploadedContact(data_to_send)
    }
</script>

<style scoped>
    .is-hidden {
        display: none;
    }
    .is-block {
        display: block;
    }
</style>