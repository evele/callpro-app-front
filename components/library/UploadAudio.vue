<template>
    <FileUpload name="file" :multiple="false" accept=".wav, .mp3, .ogg, .mp4, .m4a" :maxFileSize="20000000" :auto="false" @select="onSelectedFiles">
        <template ref="fileUploadHeader" #header="{chooseCallback, clearCallback}"> 
            <button ref="openFileSelector" @click="chooseCallback()" class="hidden"></button>    
            <button ref="clearFileSelection" @click="clearCallback()" class="hidden"></button>    
        </template>
        <template #empty>
            <div class="flex flex-col items-center pt-11 pb-9" v-if="show_dropzone">
                <CircleSVG class="text-[#E8DEF8]"/>
                <p class="font-medium text-center">Drop files here<br>or select <a href="#" class="text-[#674fa4] underline" @click.prevent="open_file_selection">here</a> to upload</p>
            </div>
        </template>
        <template #content="{files}">
            <UploadFileStatus
                :uploading="uploading"
                :upload-error="upload_error"
                :upload-success="upload_success"
                :file-name="files[0]?.name??''"
                :file-size="files[0]?.size"
                :progress-size-percent="progress_size_percent"
                :total-size-percent="total_size_percent"
                @clear="clear_file_seletion"
            ></UploadFileStatus>
        </template>
    </FileUpload>

    <InfoPanel v-if="!has_uploaded" class="mt-7">
        <p class="font-bold">Accepted format files: <span class="font-normal">.mp3, .wav, .ogg, .mp4, .m4a</span></p>
    </InfoPanel>

    <div class="w-full flex mt-6">
        <Button class="mx-auto w-[300px]" @click="save_audio" :disabled="disable_save_button">
            {{ isPendingSave ? 'Saving...' : 'Save' }}
        </Button>
    </div>
</template>

<script setup lang="ts">
    import CircleSVG from '../svgs/CircleSVG.vue';

    const { mutate: uploadAudio, isSuccess: uploadedSuccess, data: uploadedData, isPending: isUploading } = useUploadAudio();
    const { mutate: saveAudio, isPending: isPendingSave } = useSaveAudio()
    
    type UploadedAudioData = {
        file_name: string;
        name: string;
    }
    const uploadedAudio: Ref<UploadedAudioData> = ref({
        file_name: '',
        name: ''
    });

    const emit = defineEmits(['close', 'success', 'error']);
   
    const has_uploaded = ref(false);
    const upload_error = ref(false)
    const upload_success = ref(false)
    const uploading = ref(false)

    const selected_contacts_ids:Ref<number[]> = ref([]) 

    const total_size_percent:Ref<number> = ref(0)
    const progress_size_percent:Ref<number> = ref(0)

    type FileUploadEvent = {
        originalEvent: Event;
        files: File[]
    }

    const createFormData = (file: File): FormData => {
        const formData = new FormData();
        formData.append('file', file);
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
        has_uploaded.value = false
        upload_error.value = false
        upload_success.value = false
        uploading.value = false
        total_size_percent.value = 0
        progress_size_percent.value = 0
        uploadedAudio.value = { file_name: '', name: '' }
        selected_contacts_ids.value = []
    }
    
    const onSelectedFiles = (files: FileUploadEvent) => {
        uploadEvent(files.files);
    };

    const uploadEvent = (file: File[]) => {
        const data_to_send = createFormData(file[0]);
        
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
        
        uploadAudio(data_to_send, {
            onSuccess: (response: uploadAudioResponse | APIResponseError) => {
                if(response.result) {
                    setTimeout(() => {
                        total_size_percent.value = 100
                        progress_size_percent.value = 100
                        has_uploaded.value = true
                        upload_success.value = true

                        uploadedAudio.value = {
                            file_name: response.data.upload_data.file_name,
                            name: response.data.upload_data.client_name
                        }
                    }, 1000);
                } else {
                    setTimeout(() => {
                        total_size_percent.value = 99 
                        progress_size_percent.value = 99
                        upload_error.value = true
                    }, 1000);
                }
            },
            onError: () => {
                setTimeout(() => {
                    total_size_percent.value = 99 
                    progress_size_percent.value = 99
                    upload_error.value = true
                }, 1000);
            }
        });
    };    

    const save_audio = () => {
        if(!uploadedAudio.value.file_name) {
            emit('error', 'Something went wrong! Please try again.')
            return
        }

        const data_to_send: AudioToSave = {
            action: 'create',
            audio_info: [{
                file_name: uploadedAudio.value.file_name,
                name: uploadedAudio.value.name
            }]
        }

        saveAudio(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    clear_file_seletion()
                    emit('success', 'Audio saved successfully!')
                    emit('close')
                } else {
                    emit('error', 'Failed to save audio!')
                }
            },
            onError: () => emit('error', 'Failed to save audio!')
        })
    }

    const show_dropzone = computed(() => !uploading.value && !has_uploaded.value && !upload_error.value)
    const disable_save_button = computed(() => !uploadedAudio.value.file_name)
</script>