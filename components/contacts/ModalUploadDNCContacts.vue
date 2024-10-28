<template>
    <Dialog v-model:visible="show_modal" :closable="false" class="w-full max-w-[850px] mx-4 flex flex-col gap-4 md:gap-7">
        <template #header>
            <header class="w-full flex justify-between pb-5">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">Upload new file <ChevronDownSVG /></h2>
                <Button @click="close = false" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <section class="">
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

            <div class="mt-4 mb-6 px-10 w-full text-[#757575]">
                <p>Accepted format files: .csv, .xlsx</p>
                <p>More info: your data should be in this format:</p>
                <ul class="pl-16">
                    <li>Column A: Number (required)</li>
                </ul>
            </div>
        </section>
    </Dialog>
</template>

<script setup lang="ts">
    const { mutate: uploadContact, isPending } = useUploadDNCContact();

    const show_modal = ref(false);

    const open = () => {
        show_modal.value = true;
    }

    const close = () => {
        show_modal.value = false;
    }

    defineExpose({ open });

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

        // TODO: ESTÁ ANDANDO, TENGO QUE AGREGAR TOAST Y CLOSE IF SUCCESS
        uploadContact(data_to_send);
    };

</script>

<style scoped lang="scss">
   
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