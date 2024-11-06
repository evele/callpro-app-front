<template>
    <section class="flex flex-wrap gap-10">
        <ButtonLibrary @click="handle_lbry_btn_action('upload')">
            <Avatar class="bg-[#E8DEF8] mb-2" size="xlarge" shape="circle">
                <UploadAudioSVG class="w-8 h-8 text-[#4F378B]" />
            </Avatar>
            <p class="font-medium">Upload</p>
            <p class="font-medium">an audio</p>
        </ButtonLibrary>
        <ButtonLibrary @click="handle_lbry_btn_action('tts')">
            <Avatar class="bg-[#CFF7D3] mb-2" size="xlarge" shape="circle">
                <TextSVG class="w-8 h-8 text-[#009951]" />
            </Avatar>
            <p class="font-medium">Add Text to</p>
            <p class="font-medium">Speech (TTS)</p>
        </ButtonLibrary>
        <ButtonLibrary @click="handle_lbry_btn_action('call')">
            <Avatar class="bg-[#fff1c2] mb-2" size="xlarge" shape="circle">
                <CallInSVG class="w-7 h-7 text-[#E5A000]" />
            </Avatar>
            <p class="font-medium">Call In</p>
            <p class="font-medium">audio</p>
        </ButtonLibrary>
    </section>
</template>

<script setup lang="ts">
    const handle_lbry_btn_action = (action: string) => {
        switch(action) {
            case 'upload':
                console.log('upload')
                break
            case 'tts':
                console.log('tts')
                break
            case 'call':
                console.log('call')
                break
        }
    }
</script>