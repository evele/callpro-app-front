<template>
    <Dialog v-model:visible="visible" style="width: 100%; max-width: 850px; padding: 10px; max-height: 98vh; overflow-y: auto;">
        <template #container>
            <div class="modal__bg"></div>
            <section class="modal__container">
                <div class="modal__layout">
                    <header class="modal__header">
                        <h2 class="modal__header--title">Upload new file <ChevronDownSVG /></h2>
                        <Button class="modal__header--close" @click="close"><CloseSVG/></Button>
                    </header>

                    

                    <section class="modal__dropfile special-input">
                        <FileUpload name="file" :multiple="false" class="special-input" @upload="onAdvancedUpload($event)" accept=".csv, .xlsx, .xls" :maxFileSize="200000" @select="onSelectedFiles">
                            <template #header="{ files }">
                                <Button @click="uploadEvent(files)" class="is-hidden" />
                            </template>

                            <template #content>
                                <span style="display: none;"></span>
                            </template>

                            <template #empty>
                                    <div class="modal__dropfile--container">
                                        <CircleSVG style="color: #E8DEF8;" />
                                        <p class="modal__dropfile--content">Drop files here to download</p>
                                    </div>
                            </template>
                        </FileUpload>
                    </section>

                    <ProgressSpinner style="width: 50px; height: 50px; color:red;" strokeWidth="8" fill="green"
                        animationDuration=".5s" aria-label="Custom ProgressSpinner" 
                    />

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


                    <div class="modal__info">
                        <p>Accepted format files: .csv, .xlsx</p>
                        <p>Your data should be in this order:</p>
                        <ul>
                            <li>Column A: First Name (optional)</li>
                            <li>Column B: Last Name (optional)</li>
                            <li>Column C: Number (required)</li>
                            <li>Column D, E, F...: Number (optional)</li>
                        </ul>
                    </div>
                    <footer class="modal__footer">
                        <Button label="Save" @click="close" class="modal__footer--btn" :disabled="can_save" />
                    </footer>
                </div>
            </section>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const props = defineProps({
        selectedGroup: { type: String, required: true }
    })
    
    const { mutate: uploadContact, isSuccess: uploadedSuccess, data: uploadedData, isPending } = useUploadContact();
    const { mutate: saveUploadedContact, isSuccess: savedSuccess, data: savedData } = useSaveUploadedContact();

    const visible = ref(false);
    const can_save = ref(false);
    const contacts: Ref<uploadedContactToSave[]> = ref([]);
    const group_id = ref('');

    const open = () => {
        visible.value = true;
        const body = document.body;
        body.style.overflow = 'hidden';
    }

    const close = () => {
        visible.value = false;
        const body = document.body;
        body.style.overflow = 'auto';
    }

    defineExpose({ open });

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
        uploadEvent(files.files);
    };

    const uploadEvent = (file: File[]) => {
        contacts.value = [];

        const data: UploadContactData = {
            file: file[0],
            from_broadcast: 'false',
            save_contact: 'true',
            group_id: props.selectedGroup
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

<style scoped lang="scss">

    .modal__bg {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal__container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: #FFF;
        padding-bottom: 38px;
        border-radius: 30px;
        width: 100%;
    }

    .modal__layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 38px;
        width: 100%;
    }

    .modal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 90px;
        padding: 0 20px;
        border-bottom: 1px solid #CAC4D0;
        @media (min-width: 400px) {
            padding: 0 34px;
        }
    }

    .modal__header--title {
        color: #000;
        font-size: 18px;
        font-weight: 600;
        line-height: 140%;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: auto 0;
        @media (min-width: 400px) {
            font-size: 23.8px;
        }
    }

    .modal__header--close {
        background-color: transparent;
        border: none;
        cursor: pointer;
        border-radius: 100%;
        padding: 6px;
    }
    .modal__header--close:hover {
        background-color: #F5F5F5;
    }

    .modal__dropfile {
        padding: 0 26px;
        width: 100%;
        @media (min-width: 400px) {
            padding: 0 38px;
        }
    }

    .modal__dropfile--container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 261px;
        padding: 30px 10px;
        justify-content: center;
        align-items: center;
        gap: 30px;
        border: 1.4px solid #CAC4D0;
        border-radius: 7.2px;
    }
    
    .modal__dropfile--content {
        color: #000;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        line-height: 140%;
    }

    .modal__info {
        padding: 0 26px;
        width: 100%;
        color: #757575;
        font-size: 14px;
        line-height: 140%;
        @media (min-width: 400px) {
            padding: 0 38px;
        }
    }
    .modal__info ul {
        padding-left: 20px;
        @media (min-width: 400px) {
            padding-left: 60px;
        }
    }

    .modal__footer {
        width: 100%;
        text-align: center;
        padding: 0 26px;
    }

    .modal__footer--btn {
        border-radius: 30px;
        max-width: 300px;
        width: 100%;
        height: 40px;
        background-color: #653494;
        color: #FFF;
        border: 1px solid #FFF;
        font-size: 15.854px;
        font-weight: 700;
        line-height: 100%;
        transition: background-color 0.3s;
    }
    .modal__footer--btn:hover {
        background-color: #4A1D6E;
        cursor: pointer;
    }

    .modal__footer--btn[disabled] {
        opacity: 0.6;
        background-color: rgba(101, 52, 148, 0.60);
        color: #B3B3B3;
        border: 1px solid #B3B3B3;
    }

    .is-hidden {
        display: none;
    }
</style>