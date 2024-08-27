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
            <FileUpload name="file" :multiple="false" accept=".csv, .xlsx, .xls" :maxFileSize="200000">
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

        <section v-if="uploadedSuccess && uploadedData?.result">
            <div>
                <h3 class="has-text-primary has-text-weight-semibold mb-2">Contact to save</h3>
                <p class="has-text-primary">First name: {{ uploadedData?.contact?.first_name }}</p>
                <p class="has-text-primary">Last name: {{ uploadedData?.contact?.last_name }}</p>
                <p class="has-text-primary" v-if="uploadedData?.contact?.numbers?.length" v-for="number in uploadedData?.contact?.numbers" :key="number?.number">
                    Number: {{ number?.number }}
                </p>
            </div>

            <button class="button is-primary" @click="save_contact">Save Contact</button>
        </section>
    </div>
</template>

<script setup lang="ts">
    const primevue = usePrimeVue();

    const selectedGroup: Ref<SelectOption['name']> = ref('all');

    const first_name: Ref<string> = ref('');
    const last_name: Ref<string> = ref('');
    const group_id: Ref<string> = ref('');
    const numbers: Ref<string[]> = ref([]);

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()
    const { mutate: uploadContact, isSuccess: uploadedSuccess, data: uploadedData } = useUploadContact();
    const { mutate: saveUploadedContact, isSuccess: savedSuccess } = useSaveUploadedContact();

    const onRemoveTemplatingFile = (removeFileCallback, index) => {
        removeFileCallback(index);
    }

    const uploadEvent = (file) => {
        const uploadedContact = new FormData();

        uploadedContact.append('file', file[0]);
        uploadedContact.append('from_broadcast', 'false');
        uploadedContact.append('save_contact', 'true');
        uploadedContact.append('group_id', selectedGroup.value);

        uploadContact(uploadedContact, {
            onSuccess: (data) => {
                if(data.result) {
                    first_name.value = data.contact.first_name;
                    last_name.value = data.contact.last_name;
                    group_id.value = data.group_id;
                    data.contact.numbers.forEach((number: any) => {
                        numbers.value.push(number.number)
                    });
                }
            }
        });
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

    const save_contact = () => {
        type ContactToSave = {
            first_name: string;
            last_name: string;
            number: string;
            contact_id: string;
        }

        const contact_to_save: ContactToSave[] = []

        numbers.value.forEach((number: string) => {
            contact_to_save.push({
                first_name: first_name.value,
                last_name: last_name.value,
                number: number,
                contact_id: 'fake-1'
            });
        });

        const data_to_send = {
            contact: contact_to_save,
            group_id: group_id.value
        }

        saveUploadedContact(data_to_send)
    }
</script>