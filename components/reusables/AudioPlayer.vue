<template>
    <div>
        <Button v-if="!isAudioLoaded" @click="loadAudio" class="audio-load-button">
            <AudioSVG />            
        </Button>
        <audio v-else controls>
            <source :src="audioUrl" :type="audioType">
            {{ fallbackMessage }}
        </audio>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        audioUrl: { type: String, required: true },
        audioType: { type: String, required: false, default: 'audio/wav' },
        fallbackMessage: { type: String, required: false, default: 'Your browser does not support the audio element.' }
    });

    const isAudioLoaded = ref(false);
    const loadAudio = () => {
        isAudioLoaded.value = true;
    };
</script>

<style scoped>
.audio-load-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    background: none;
    border: none;
    color: inherit;
    font-size: 0.9rem;
    padding: 0;
}
</style>