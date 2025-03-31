<template>
    <div v-if="uploading" class="flex items-center gap-14 pt-20 pb-11 m-auto max-w-xl">
        <div>
            <Avatar v-if="uploadError" class="bg-white border-2 border-danger w-24 h-24" shape="circle">
                <template #icon>
                    <CloseSVG class="text-danger w-10 h-10"/>
                </template>
            </Avatar>
            <Avatar v-else-if="uploadSuccess" class="bg-white border-2 border-success w-24 h-24" shape="circle">
                <template #icon>
                    <CheckSVG class="text-success w-14 h-14"/>
                </template>
            </Avatar>
            <Avatar v-else class="bg-white border-2 border-black w-24 h-24" shape="circle">
                <template #icon>
                    <FileSVG class="text-black w-10 h-10"/>
                </template>
            </Avatar>
        </div>

        <div class="w-full flex flex-col gap-4">
            <div class="text-xl font-light"><span class="font-medium mr-4">{{ fileName??"" }}</span>{{ formatFileSize(fileSize)}} </div>
            <div>
                <ProgressBar :show-value="false" :value="progressSizePercent" :pt="{value: ()=>[{'bg-danger':uploadError, 'bg-success':uploadSuccess}]}">
                </ProgressBar>
            </div>
            
            <div v-if="uploadError" class="text-lg">Upload error - Check the upload requirements below</div>
            <div v-else-if="uploadSuccess" class="text-lg">Upload complete!</div>
            <div v-else class="text-lg">{{totalSizePercent}}% Uploaded</div>
        </div>

        <div>
            <Avatar v-if="uploadError || uploadSuccess" class="bg-white p-0 border w-9 h-9 hover:cursor-pointer hover:bg-gray-100 transition-colors" shape="circle" @click="emit('clear');">
                <template #icon>
                    <TrashSVG class="w-4 h-4"></TrashSVG>
                </template>
            </Avatar>
        </div>
    </div>
</template>
<script setup>
    const props =  defineProps({
        uploading: { type: Boolean },
        uploadError: { type: Boolean },
        uploadSuccess: { type: Boolean, required: false, default: false },
        fileName: { type: String },
        fileSize: { type: Number },
        progressSizePercent: { type: Number },
        totalSizePercent: { type: Number }
    })

    const emit = defineEmits(['clear'])
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