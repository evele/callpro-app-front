<template>
    <div>
        <audio controls>
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

</script>