<template>
    <Dialog v-model:visible="visible" pt:root:class="modal">
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
                            <template #header="{ files }">
                                <Button @click="uploadEvent(files)" class="is-hidden" />
                            </template>

                            <template #content>
                                <span style="display: none;"></span>
                            </template>

                            <template #empty>
                                    <div class="modal__dropfile--container">
                                        <CircleSVG style="color: #E8DEF8;" />
                                        <p class="modal__dropfile--content">Drop files here to upload</p>
                                    </div>
                            </template>
                        </FileUpload>
                    </section>

                    <p v-if="isPending">Uploading File...</p>

                    <section v-if="has_uploaded">
                        <div v-if="uploadedSuccess && uploadedData?.result">
                            <DataTable 
                            v-if="uploadedData?.contacts?.length" 
                            v-model:selection="selectedContacts" 
                            :value="formatted_contact" 
                            dataKey="name" 
                            tableStyle="min-width: 40rem" 
                            scrollable scrollHeight="350px" 
                            class="uploaded-contacts-table">
                                <Column headerStyle="width: 3rem">
                                    <template #header="headerSlot">
                                        <input 
                                            type="checkbox" 
                                            :checked="isAllSelected" 
                                            @change="toggleSelectAll($event)" 
                                        />                                        
                                    </template>
                                    <template #body="slotProps">                                        
                                        <input 
                                        type="checkbox" 
                                        :disabled="slotProps.data.disabled"  
                                        :checked="isSelected(slotProps.data)"
                                        @change="toggleSelection(slotProps.data, $event)"
                                        />
                                    </template>
                                </Column>
                                <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>                                
                            </DataTable>
                            <p v-else class="text-no-contacts">There is no contacts on your file</p>
                        </div>
                        <div v-if="uploadedSuccess && uploadedData?.result">
                            <table class="table-auto w-full border-collapse shadow-lg rounded-lg">
                                <thead class="bg-gray-100 border-b border-gray-300">
                                    <tr>
                                    <th class="px-4 py-2"> 
                                        <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll($event)" />
                                    </th>
                                    <th class="px-4 py-2 text-left text-gray-700">Last, First</th>
                                    <th class="px-4 py-2 text-left text-gray-700">Phone</th>
                                    <th class="px-4 py-2 text-left text-gray-700 text-center">Status</th>
                                    <th class="px-4 py-2 text-left text-gray-700 text-center">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Iterar sobre cada contacto -->
                                    <template v-for="contact in contacts" :key="contact.contact_id">
                                    <!-- Iterar sobre cada número de contacto -->
                                    <tr v-for="number in contact.numbers" :key="number.number" class="bg-white even:bg-gray-50 hover:bg-gray-100">
                                        <td class="px-4 py-2">
                                        <input type="checkbox"/>
                                        <Checkbox v-model="selected_contacts_ids" :inputId="contact.contact_id.toString()" name="selected_contacts" :value="contact.contact_id" />
                                        </td>
                                        <td class="px-4 py-2">{{ contact.last_name }}, {{ contact.first_name }}</td>
                                        <td class="px-4 py-2">{{ number.number }}</td>
                                        <td class="px-4 py-2">
                                            <CheckSVG v-if="number.valid" class="m-auto" color="green"/>
                                            <ErrorIconSVG v-else class="m-auto"/>
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
                        <Button @click="save_contact" class="modal__footer--btn" :disabled="savedIsPending || is_disabled">
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

    onMounted(() => {
        window.addEventListener('keydown', handleEscapeKey);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleEscapeKey);
    });

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            close();
        }
    };

    const visible = ref(false);
    
    const contacts: Ref<ContactUploadedData[]> = ref([]);
    /*
    const contacts_to_save = computed(()=>{
        return contacts.map()
    }) */

    const group_id = ref('');
    const has_uploaded = ref(false);
    const showError = ref(false);
    const showSuccess = ref(false);

    const formatted_contact: Ref<FormattedContact[]> = ref([]);
    const selected_contacts_ids:Ref<number[]> = ref([]) 
    // const selected_contacts_ids= ref() 
    
    const selectedContacts = ref<FormattedContact[]>([]);    

    
    const is_disabled = computed(() => {
        return !selectedContacts.value || selectedContacts.value.length === 0;
    });    

    const open = () => {
        visible.value = true;        
    }

    const close = () => {
        visible.value = false;       
        has_uploaded.value = false;
        reset();
        formatted_contact.value = [];        
        contacts.value = [];
        selectedContacts.value = [];
        showError.value = false;
        showSuccess.value = false;        
    }

    defineExpose({ open });

    type FormattedContact = {
        selected?: boolean;
        name: string;
        number: number;
        status: boolean;
        result: string;
        first_name?: string;
        last_name?: string;
        contact_id?: string;
        disabled?: boolean;
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
        showError.value = true;
        const data_to_send = createFormData(data);

        uploadContact(data_to_send, {
            onSuccess: (data) => {
                if(data.result && data.contacts?.length) {
                    has_uploaded.value = true;
                    /*
                    data.contacts.forEach((contact, i) => {
                        contact.numbers.forEach(number => {
                            if(number.validation_desc === 'ok') {                                
                                selectedContacts.value.push({     
                                    selected:true,                               
                                    name: contact?.first_name === "" && contact?.last_name === "" ? "" : `${contact?.last_name}, ${contact?.first_name}`,
                                    first_name:contact.first_name || "",
                                    last_name: contact.last_name || "",
                                    number: number?.number,
                                    contact_id: `fake-${i+1}`,
                                    status: contact?.valid,
                                    result: contact?.validation_desc
                                })
                            }

                            formatted_contact.value.push({                                
                                name: contact?.first_name === "" && contact?.last_name === "" ? "" : `${contact?.last_name}, ${contact?.first_name}`,
                                number: number?.number,
                                status: contact?.valid,
                                result: contact?.validation_desc === "Valid and inserted" ? 'Ok' : contact?.validation_desc,
                                disabled: number.validation_desc != 'ok' ? true : false
                            });
                            
                        });
                        
                    }) */
                    group_id.value = data.group_id || 'all';
                    contacts.value = data.contacts
                }
            }
        });
    };    

    const isSelected = (contact: FormattedContact) => {
        return selectedContacts.value.some(selected => selected.name === contact.name && selected.number === contact.number);
    }

    const toggleSelection = (contact: FormattedContact, event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {            
            selectedContacts.value.push(contact);
        } else {            
            selectedContacts.value = selectedContacts.value.filter(selected => selected.name !== contact.name || selected.number !== contact.number);
        }
    }

    const isAllSelected = computed(() => {        
        return formatted_contact.value.every(contact => contact.disabled || isSelected(contact));
    });

    const toggleSelectAll = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {            
            formatted_contact.value.forEach(contact => {
                if (!contact.disabled && !isSelected(contact)) {
                    selectedContacts.value.push(contact);
                }
            });
        } else {            
            selectedContacts.value = selectedContacts.value.filter(contact => contact.disabled);
        }
    };
    
    const save_contact = () => {  
        // TODO controlar el momento posterior al save, y anterior al cierre del modal, el boton save se muestra habilitado 
        const formattedContacts = selectedContacts.value.map(contact => ({
            ...contact,
            first_name: contact.first_name || "", 
            last_name: contact.last_name || "",   
            contact_id: contact.contact_id || ""  
        }));   
        const data_to_send: uploadedContactToSaveData = {
            contacts: formattedContacts,
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

    const columns = [        
        { field: 'name', header: 'Last, First' },
        { field: 'number', header: 'Phone' },
        { field: 'status', header: 'Status' },
        { field: 'result', header: 'Result' },        
    ];
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