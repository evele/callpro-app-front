<template>
    <FileUpload name="file" :multiple="false" accept=".csv, .xlsx, .xls" :maxFileSize="200000" :auto="false" @select="onSelectedFiles">
        <template ref="fileUploadHeader" #header="{chooseCallback, clearCallback}"> 
            <button ref="openFileSelector" @click="chooseCallback()" class="hidden"></button>    
            <button ref="clearFileSelection" @click="clearCallback()" class="hidden"></button>    
        </template>
        <template #empty>
            <div class="flex flex-col items-center pt-11 pb-9">
                <CircleSVG class="text-[#E8DEF8]"/>
                <p class="font-medium text-center">Drop files here<br>or select <a href="#" class="text-[#674fa4] underline" @click.prevent="open_file_selection">here</a> to upload</p>
            </div>
        </template>
        <template  #content="{files}">
            
            <UploadFileStatus
                :uploading="uploading"
                :upload-error="upload_error"
                :file-name="files[0]?.name??''"
                :file-size="files[0]?.size"
                :progress-size-percent="progress_size_percent"
                :total-size-percent="total_size_percent"
                @clear="clear_file_seletion"
            ></UploadFileStatus>
            <div v-if="has_uploaded">
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
            </div>
        </template>
    </FileUpload>

    <InfoPanel v-if="!has_uploaded" class="mt-7">
        <p class="font-bold">Accepted format files: <span class="font-normal">.csv, .xlsx</span></p>
        <p class="font-bold">Your data should be in this order:</p>
        <ul class="list-disc pl-14">
            <li>Column A: First Name (optional)</li>
            <li>Column B: Last Name (optional)</li>
            <li>Column C: Number (required)</li>
            <li>Column D, E, F...: Number (optional)</li>
        </ul>
    </InfoPanel>

    <div class="w-full flex mt-6">
        <Button class="mx-auto w-[300px]" @click="save_contact" :disabled="savedIsPending || selected_contacts_ids.length == 0">
            {{ !savedIsPending ? 'Save' : 'Saving...' }}
        </Button>
    </div>
</template>

<script setup lang="ts">
    import InfoPanel from '../reusables/InfoPanel.vue';
    import CheckSVG from '../svgs/CheckSVG.vue';
    import ErrorIconSVG from '../svgs/ErrorIconSVG.vue';

    const props = defineProps({
        selectedGroup: { type: String, required: true }
    })
    
    const { mutate: uploadContact, isSuccess: uploadedSuccess, data: uploadedData, isPending, isError,reset } = useUploadContact();
    const { mutate: saveUploadedContact, isSuccess: savedSuccess, data: savedData, isPending: savedIsPending } = useSaveUploadedContact();
    
    const contacts: Ref<ContactUploadedData[]> = ref([]);

    const emit = defineEmits(['close', 'success', 'error', 'changeTitle']);
   
    const group_id = ref('');
    const has_uploaded = ref(false);
    const upload_error = ref(false)
    const uploading = ref(false)

    const selected_contacts_ids:Ref<number[]> = ref([]) 

    const total_size_percent:Ref<number> = ref(0)
    const progress_size_percent:Ref<number> = ref(0)

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

    const fileUploadHeader= ref(null)

    const openFileSelector=ref<HTMLButtonElement | null>(null);
    const clearFileSelection=ref<HTMLButtonElement | null>(null);
        
    const open_file_selection = () => {
        openFileSelector?.value?.click()
    } 

    const clear_file_seletion = () => {
        clearFileSelection?.value?.click()
        reset()
        has_uploaded.value = false
        upload_error.value = false
        uploading.value = false
        total_size_percent.value = 0
        progress_size_percent.value = 0
        contacts.value = []
        selected_contacts_ids.value = []
    }
    
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
        
           // Iniciar la barra de progreso en 0 y aumentar gradualmente
        total_size_percent.value = 0;
        uploading.value = true
        const progressInterval = setInterval(() => {
            if (total_size_percent.value == 50) {
                progress_size_percent.value = 50
            }
            if (total_size_percent.value < 90) { // Limitar hasta un 90% antes de recibir respuesta
                total_size_percent.value += 2; // Incremento pequeño para simular carga continua
            } else {
                clearInterval(progressInterval); // Detener si llega al 90% o si se recibe una respuesta
            }
        }, 30); // Cada 50ms para un aumento suave
        uploadContact(data_to_send, {
            onSuccess: (data) => {
                if(data.result && data.contacts?.length) {
                    /* TODO: check if belongs to group or not (not here probbly before upload) */
                    group_id.value = data.group_id || 'all';
                    contacts.value = data.contacts
                    setTimeout(() => {
                        total_size_percent.value = 100
                        progress_size_percent.value = 100
                        has_uploaded.value = true
                        uploading.value = false
                        emit('changeTitle', 'Upload Summary')
                    }, 1000);
                } else {
                    setTimeout(() => {
                        total_size_percent.value = 99 
                        progress_size_percent.value = 99
                        upload_error.value = true
                    }, 1000);
                }
            }
        });
    };    

    // TODO: set the right colors if selected
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
            onSuccess: (response: SaveUploadedContactAPIResponse | APIResponseError) => {
                if(response.result)  {
                    emit('success', 'Contacts saved successfully!')
                    emit('close')
                    clear_file_seletion()
                } else {
                    emit('error', 'Something went wrong, please try again')
                }
            },
            onError: () => {
                emit('error', 'Something went wrong, please try again')
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
    
</style>