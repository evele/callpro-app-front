<template>
    <Dialog v-model:visible="show_upload_dnc_modal" modal :draggable="false" :closable="false" class="w-full max-w-[800px] mx-4 flex flex-col gap-4 md:gap-7 pb-8">
        <template #header>
            <header class="w-full flex justify-between pb-5 px-8">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">Upload new file <ChevronDownSVG /></h2>
                <Button @click="close_upload_dnc_modal" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <section>
            <div class="modal__dropfile">
                <FileUpload name="file" :multiple="false" accept=".csv, .xlsx, .xls" :maxFileSize="200000" @select="onSelectedFiles">
                    <template #header="{ files }">
                        <Button @click="uploadEvent(files)" class="hidden" />
                    </template>

                    <template #content>
                        <ProgressBar v-if="isPending" mode="indeterminate" style="height: 6px"></ProgressBar>
                    </template>

                    <template #empty>
                            <div class="modal__dropfile--container">
                                <CircleSVG class="text-[#E8DEF8]" />
                                <p class="modal__dropfile--content">Drop files here to upload</p>
                            </div>
                    </template>
                </FileUpload>
            </div>
        </section>

        <InfoPanel class="mt-7">
            <p class="font-bold">Accepted format files: <span class="font-normal">.csv, .xlsx</span></p>
            <p class="font-bold">More info: your data should be in this format:</p>
            <ul class="list-disc pl-14">
                <li>Column A: Number (required)</li>
            </ul>
        </InfoPanel>
    </Dialog>
</template>

<script setup lang="ts">
    const { mutate: uploadContact, isPending } = useUploadDNCContact();

    const show_upload_dnc_modal = ref(false);

    const open_upload_dnc_modal = () => {
        show_upload_dnc_modal.value = true;
    }

    const close_upload_dnc_modal = () => {
        show_upload_dnc_modal.value = false;
    }

    defineExpose({ open_upload_dnc_modal });
    const emit = defineEmits(['show_toast']);

    type UploadContactData = {
        file: File;
    };

    type FileUploadEvent = {
        originalEvent: Event;
        files: File[]
    }

    const createFormData = (data: UploadContactData): FormData => {
        const formData = new FormData();
        formData.append('file', data.file);
        return formData;
    };

    const onSelectedFiles = (files: FileUploadEvent) => {
        uploadEvent(files.files);
    };

    const uploadEvent = (file: File[]) => {
        const data: UploadContactData = {
            file: file[0],
        };
 
        const data_to_send = createFormData(data);

        uploadContact(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                response.result ? emit('show_toast', 'success') : emit('show_toast', 'error')
                close_upload_dnc_modal()
            },
            onError: () => {
                close_upload_dnc_modal()
                emit('show_toast', 'error')
            }
        });
    };

</script>

<style scoped lang="scss">
::v-deep(.p-fileupload-file-list) {
    display: none;
}
   
    .modal__dropfile {
        padding: 0;
        width: 100%;
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
        
        border-radius: 7.2px;
    }
    
    .modal__dropfile--content {
        color: #000;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        line-height: 140%;
    }
</style>