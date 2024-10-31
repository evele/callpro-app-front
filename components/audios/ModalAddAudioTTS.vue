<template>
    <Dialog v-model:visible="visible" modal header="Add Audio from TTS" class="text-2xl w-full max-w-[850px]">  
        <Divider class="max-w-[850px]" />      
        <div class="flex flex-col gap-[38px] mt-9">
            
            <div
                className="w-[786px] h-[49px] pl-2.5 pr-[38px] py-2 bg-[#4f378b]/20 rounded-tl-[10px] rounded-tr-[10px] border-b border-[#9747ff] justify-start items-center inline-flex">
                <div className="w-[738px] h-[33px] text-[#1e1e1e] text-sm font-normal font-['Inter'] leading-snug">Type
                    the message here to have it converted to audio.</div>
            </div>            
            <textarea 
                v-model="text_to_convert" 
                placeholder="Enter text" 
                class="h-[97.75px] px-4 py-3 bg-white rounded-[9.68px] border border-[#d9d9d9] w-full text-[#1e1e1e] text-base font-normal leading-snug">
            </textarea>
        </div>    
        <template #footer>
                <Button type="button" class="justify-center items-center w-[300px] mx-auto mt-[38px]" :disabled="isPending"
                    @click="convert_audio">
                    {{ isPending ? 'Converting...' : 'Convert' }}
                </Button>
            </template>
    </Dialog>
</template>

<script setup lang="ts">

const emit = defineEmits(['update:convert_text']);
const visible = ref(false);
const text_to_convert = ref("");
const isPending = ref(false); 

const close = () => {
    visible.value = false;
    text_to_convert.value = "";    
};

const convert_audio = () => {
    if (!(text_to_convert.value.trim())) {
        alert('No se puede convertir texto vacío');
        return;
    }
    const dataToSend = {
        text_to_convert : text_to_convert.value,
    }
    isPending.value = true;
    emit('update:convert_text', dataToSend);
    setTimeout(() => {
        isPending.value = false;
        close();
    }, 2000);   
}
const open = () => {
    visible.value = true;
    console.log("open")
}
defineExpose({ open });
</script>