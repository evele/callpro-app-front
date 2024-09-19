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
            onSuccess: (data: UploadContactAPIResponse | APIResponseError) => {
                if(data && data.result && data.contacts?.length) {
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
