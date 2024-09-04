<template>
    <div>
        <button v-if="!isAudioLoaded" @click="loadAudio" class="audio-load-button">
            <AudioSVG />
            <span class="audio-text">Cargar Audio</span>
        </button>
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
    gap: 8px;
    cursor: pointer;
    background: none;
    border: none;
    color: inherit;
    font-size: 1em;
    padding: 0;
}
.audio-text {
    font-size: 0.95rem;
}
</style>