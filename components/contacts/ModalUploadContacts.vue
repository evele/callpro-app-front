<template>
    <Dialog v-model:visible="visible" :draggable="false" @hide="close" class="max-w-[850px] w-[90vw]">
        <template #header>
            <h2 v-if="has_uploaded" >Upload Summary</h2>
            <h2 v-else >Upload new file <ChevronDownSVG /></h2>
        </template>      
        <section>
            <FileUpload name="file" :multiple="false" accept=".csv, .xlsx, .xls" :maxFileSize="200000" @select="onSelectedFiles">
                <template #content="{files}">
                    <div class="flex items-center gap-16">
                        <div>
                            <Avatar v-if="!upload_error" class="bg-white border border-black" size="xlarge" shape="circle">
                                <template #icon>
                                    <FileSVG  class="text-black w-7"/>
                                </template>
                            </Avatar>
                            <Avatar v-else class="bg-white border border-danger" size="xlarge" shape="circle">
                                <template #icon>
                                    <CloseSVG class="text-danger w-7"/>
                                </template>
                            </Avatar>
                        </div>
                        <div class="w-full flex flex-col gap-4">
                            <div class="text-xl font-light"><span class="font-medium mr-4">{{ files[0]?.name??"" }}</span>{{ formatFileSize(files[0]?.size)}} </div>
                            <div>
                                <ProgressBar :show-value="false" :value="total_size_percent" :pt="{value: ()=>[{'bg-danger':upload_error}]}">
                                </ProgressBar>
                            </div>
                                
                            <div class="text-lg">{{total_size_percent}}% Uploaded</div>
                        </div>
                    </div>
                </template>
                <template #empty>
                        <div >
                            <CircleSVG style="color: #E8DEF8;" />
                            <p>Drop files here or select <span >here</span> to upload</p>
                        </div>
                </template>
            </FileUpload>
        </section>
        <section v-if="has_uploaded">
            <div v-if="uploadedSuccess && uploadedData?.result">
                <table class="table-auto w-full border-collapse shadow-lg rounded-lg">
                    <thead class="bg-gray-100 border-b border-gray-300">
                        <tr>
                        <th class="px-4 py-2"> 
                            <Checkbox :modelValue="all_selected" :indeterminate="some_selected" @change="toggle_select_all" binary/>
                        </th>
                        <th class="px-4 py-2 text-left text-gray-700">Last, First</th>
                        <th class="px-4 py-2 text-left text-gray-700">Phone</th>
                        <th class="px-4 py-2 text-left text-gray-700 text-center">Status</th>
                        <th class="px-4 py-2 text-left text-gray-700 text-center">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="contact in contacts" :key="contact.contact_id">
                        <tr v-for="(number,index) in contact.numbers" :key="number.number" class="bg-white even:bg-gray-50 hover:bg-gray-100">
                            <td v-if="index === 0" :rowspan="contact.numbers.length" class="px-4 py-2">
                                <Checkbox v-if="contact.valid"  v-model="selected_contacts_ids" :inputId="contact.contact_id.toString()" name="selected_contacts" :value="contact.contact_id" />
                            </td>
                            <td v-if="index === 0" :rowspan="contact.numbers.length" class="px-4 py-2">{{ contact.last_name }}, {{ contact.first_name }}</td>
                            <td class="px-4 py-2">{{ number.number }}</td>
                            <td class="px-4 py-2">
                                <CheckSVG v-if="number.valid" class="m-auto text-success"/>
                                <ErrorIconSVG v-else class="m-auto text-danger"/>
                            </td>
                            <td class="px-4 py-2 text-center">{{ number?.validation_desc === "Valid and inserted" ? 'Ok' : number?.validation_desc}}</td>
                        </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </section>
        <p v-if="isError || (uploadedSuccess && !uploadedData?.result)">Something went wrong!</p>
        <div v-if="!has_uploaded">
            <p>Accepted format files: .csv, .xlsx</p>
            <p>Your data should be in this order:</p>
            <ul>
                <li>Column A: First Name (optional)</li>
                <li>Column B: Last Name (optional)</li>
                <li>Column C: Number (required)</li>
                <li>Column D, E, F...: Number (optional)</li>
            </ul>
        </div>
        <template #footer>
            <ProgressBar :value="total_size_percent" class="w-full"></ProgressBar>
            <Button @click="save_contact" :disabled="savedIsPending || selected_contacts_ids.length == 0">
                            {{ !savedIsPending ? 'Save' : 'Saving...' }}
                        </Button>
        </template>
    </Dialog>
    <Dialog :visible="false" pt:root:class="modal">
        <template #container>
            <div class="modal__bg"></div>
            <section class="modal__container">
                <div class="modal__layout">
                    <header class="modal__header">
                        <h2 v-if="has_uploaded" class="modal__header--title">Upload Summary</h2>
                        <h2 v-else class="modal__header--title">Upload new file <ChevronDownSVG /></h2>
                        <Button class="modal__header--close" @click="close"><CloseSVG/></Button>
                    </header>

                    <section v-if="!has_uploaded" class="modal__dropfile special-input">
                        <FileUpload name="file" :multiple="false" class="special-input" accept=".csv, .xlsx, .xls" :maxFileSize="200000" @select="onSelectedFiles">
                            

                            <template #content>
                                <span style="display: none;"></span>
                            </template>

                            <template #empty>
                                    <div class="modal__dropfile--container">
                                        <CircleSVG style="color: #E8DEF8;" />
                                        <p class="modal__dropfile--content">Drop files here or select <span >here</span> to upload</p>
                                    </div>
                            </template>
                        </FileUpload>
                    </section>

                    <p v-if="isPending">Uploading File...</p>

                    <section v-if="has_uploaded">
                        <div v-if="uploadedSuccess && uploadedData?.result">
                            <table class="table-auto w-full border-collapse shadow-lg rounded-lg">
                                <thead class="bg-gray-100 border-b border-gray-300">
                                    <tr>
                                    <th class="px-4 py-2"> 
                                        <Checkbox :modelValue="all_selected" :indeterminate="some_selected" @change="toggle_select_all" binary/>
                                    </th>
                                    <th class="px-4 py-2 text-left text-gray-700">Last, First</th>
                                    <th class="px-4 py-2 text-left text-gray-700">Phone</th>
                                    <th class="px-4 py-2 text-left text-gray-700 text-center">Status</th>
                                    <th class="px-4 py-2 text-left text-gray-700 text-center">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="contact in contacts" :key="contact.contact_id">
                                    <tr v-for="(number,index) in contact.numbers" :key="number.number" class="bg-white even:bg-gray-50 hover:bg-gray-100">
                                        <td v-if="index === 0" :rowspan="contact.numbers.length" class="px-4 py-2">
                                            <Checkbox v-if="contact.valid"  v-model="selected_contacts_ids" :inputId="contact.contact_id.toString()" name="selected_contacts" :value="contact.contact_id" />
                                        </td>
                                        <td v-if="index === 0" :rowspan="contact.numbers.length" class="px-4 py-2">{{ contact.last_name }}, {{ contact.first_name }}</td>
                                        <td class="px-4 py-2">{{ number.number }}</td>
                                        <td class="px-4 py-2">
                                            <CheckSVG v-if="number.valid" class="m-auto text-success"/>
                                            <ErrorIconSVG v-else class="m-auto text-danger"/>
                                        </td>
                                        <td class="px-4 py-2 text-center">{{ number?.validation_desc === "Valid and inserted" ? 'Ok' : number?.validation_desc}}</td>
                                    </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <p v-if="isError || (uploadedSuccess && !uploadedData?.result)" class="text-no-contacts">Something went wrong!</p>

                    <div v-if="!has_uploaded" class="modal__info">
                        <p>Accepted format files: .csv, .xlsx</p>
                        <p>Your data should be in this order:</p>
                        <ul>
                            <li>Column A: First Name (optional)</li>
                            <li>Column B: Last Name (optional)</li>
                            <li>Column C: Number (required)</li>
                            <li>Column D, E, F...: Number (optional)</li>
                        </ul>
                    </div>

                    <p v-if="savedSuccess && showSuccess" class="text-success">Contacts Saved!</p>
                    <footer class="modal__footer">
                        <Button @click="save_contact" class="modal__footer--btn" :disabled="savedIsPending || selected_contacts_ids.length == 0">
                            {{ !savedIsPending ? 'Save' : 'Saving...' }}
                        </Button>
                    </footer>
                </div>
            </section>
        </template>
    </Dialog>
</template>

<script setup lang="ts">

    import CheckSVG from '../svgs/CheckSVG.vue';
    import ErrorIconSVG from '../svgs/ErrorIconSVG.vue';

    const props = defineProps({
        selectedGroup: { type: String, required: true }
    })
    
    const { mutate: uploadContact, isSuccess: uploadedSuccess, data: uploadedData, isPending, isError,reset } = useUploadContact();
    const { mutate: saveUploadedContact, isSuccess: savedSuccess, data: savedData, isPending: savedIsPending } = useSaveUploadedContact();

    const visible = ref(false);
    
    const contacts: Ref<ContactUploadedData[]> = ref([]);
   
    const group_id = ref('');
    const has_uploaded = ref(false);
    const showError = ref(false);
    const showSuccess = ref(false);

    const selected_contacts_ids:Ref<number[]> = ref([]) 
   
    const open = () => {
        visible.value = true;        
    }

    const total_size_percent:Ref<number> = ref(0)

    const close = () => {
        visible.value = false   
        has_uploaded.value = false
        total_size_percent.value = 0
        reset()
        contacts.value = []
        selected_contacts_ids.value = []
        showError.value = false
        showSuccess.value = false        
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

    const upload_error:Ref<boolean> = ref(false)

    const uploadEvent = (file: File[]) => {
        contacts.value = [];

        const data: UploadContactData = {
            file: file[0],
            from_broadcast: 'false',
            save_contact: 'true',
            group_id: props.selectedGroup
        };
        showError.value = true;
        const data_to_send = createFormData(data);
        total_size_percent.value = 50
        uploadContact(data_to_send, {
            onSuccess: (data) => {
                if(data.result && data.contacts?.length) {
                    /* TODO: check if belongs to group or not (not here probbly before upload */
                    group_id.value = data.group_id || 'all';
                    contacts.value = data.contacts
                    total_size_percent.value = 100
                    setTimeout(() => {
                        has_uploaded.value = true
                    }, 1000);
                } else {
                    total_size_percent.value = 99
                    upload_error.value = true
                }
            }
        });
    };    

    const all_selected = computed(() => selected_contacts_ids.value.length === contacts.value.length);
    const some_selected = computed(()=> selected_contacts_ids.value.length >0 && selected_contacts_ids.value.length < contacts.value.length)


    const toggle_select_all = () => {
        if (all_selected.value) {
            selected_contacts_ids.value = [];
        } else {
            selected_contacts_ids.value = contacts.value.map(contact => contact.contact_id);
        }
    };

    const get_selected_contacts_in_flat_format = () => {
            return contacts.value
                .filter(contact => selected_contacts_ids.value.includes(contact.contact_id))
                .flatMap(contact => 
                    contact.numbers
                    .filter(number => number.valid === true)
                    .map(number => ({
                        number: number.number,
                        first_name: contact.first_name || '',
                        last_name: contact.last_name || '', 
                        contact_id: contact.contact_id,
                        number_id: number.number_id
                    }))
            );
        };  
    
    const save_contact = () => {  
        // TODO controlar el momento posterior al save, y anterior al cierre del modal, el boton save se muestra habilitado 
       
        const contacts_in_flat_format = get_selected_contacts_in_flat_format()
        console.log("ciff",contacts_in_flat_format)
    
        const data_to_send: uploadedContactToSaveData = {
            contacts: contacts_in_flat_format,
            group_id: group_id.value
        }
        
        saveUploadedContact(data_to_send, {
            onSuccess: () => {
                // Should be a toast
                showSuccess.value = true;
                setTimeout(() => {
                    close()
                }, 2000);
            }
        })
    }
</script>

<style scoped lang="scss">

    :deep(.p-progressbar) {
        width: unset;
        position: relative;
        top: unset;
        left: unset;
        height: 1rem;
    }

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
    }

    .is-hidden {
        display: none;
    }

    .text-no-contacts {
        text-align: center;
        color: #cf2626;
        font-size: 20px;
    }

    .text-success {
        text-align: center;
        color: #1abd28;
        font-size: 20px;
    }
</style>