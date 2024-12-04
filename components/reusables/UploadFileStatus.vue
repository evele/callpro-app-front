<template>
    <div v-if="uploading" class="flex items-center gap-14 pt-20 pb-11 m-auto max-w-xl">
        <div>
            <Avatar v-if="!uploadError" class="bg-white border border-2 border-black w-24 h-24"  shape="circle">
                <template #icon>
                    <FileSVG  class="text-black w-10 h-10"/>
                </template>
            </Avatar>
            <Avatar v-else class="bg-white border border-2 border-danger w-24 h-24" shape="circle">
                <template #icon>
                    <CloseSVG class="text-danger w-10 h-10"/>
                </template>
            </Avatar>
        </div>
        <div class="w-full flex flex-col gap-4">
            <div class="text-xl font-light"><span class="font-medium mr-4">{{ fileName??"" }}</span>{{ formatFileSize(fileSize)}} </div>
            <div>
                <ProgressBar :show-value="false" :value="progressSizePercent" :pt="{value: ()=>[{'bg-danger':uploadError}]}">
                </ProgressBar>
            </div>
                
            <div class="text-lg">{{totalSizePercent}}% Uploaded</div>
        </div>
        <div>
            <Avatar v-if="uploadError" class="bg-white border w-9 h-9"  shape="circle" @click="emit('clear');">
                <template #icon>
                    <TrashSVG></TrashSVG>
                </template>
            </Avatar>
        </div>
    </div>
</template>
<script setup>
    const props =  defineProps({
        uploading: { type: Boolean },
        uploadError: { type: Boolean },
        fileName: { type: String },
        fileSize: { type: Number },
        progressSizePercent: { type: Number },
        totalSizePercent: { type: Number }
    })

    const emit = defineEmits(['clear'])
</script>