<template>
    <section class="flex flex-wrap gap-x-10 gap-y-6">
        <InfoCardLibrary />
        <ButtonLibrary @click="emit('action', 'upload')">
            <Avatar class="bg-[#E8DEF8] mb-2" size="xlarge" shape="circle">
                <UploadAudioSVG class="w-8 h-8 text-[#4F378B]" />
            </Avatar>
            <p class="font-medium">Upload</p>
            <p class="font-medium">an audio</p>
        </ButtonLibrary>
        <ButtonLibrary @click="emit('action', 'tts')">
            <Avatar class="bg-[#CFF7D3] mb-2" size="xlarge" shape="circle">
                <TextSVG class="w-8 h-8 text-[#009951]" />
            </Avatar>
            <p class="font-medium">Add Text to</p>
            <p class="font-medium">Speech (TTS)</p>
        </ButtonLibrary>
        <ButtonLibrary @click="emit('action', 'call_in')">
            <Avatar class="bg-[#fff1c2] mb-2" size="xlarge" shape="circle">
                <CallInSVG class="w-7 h-7 text-[#E5A000]" />
            </Avatar>
            <p class="font-medium">Call In</p>
            <p class="font-medium">audio</p>
        </ButtonLibrary>
    </section>
</template>

<script setup lang="ts">
   const emit = defineEmits(['action']);
</script>