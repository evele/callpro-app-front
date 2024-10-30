<template>
    <div>
        <Button v-if="!isAudioLoaded" @click="loadAudio" class="audio-load-button">
            <AudioSVG />            
        </Button>
        <audio v-else ref="audio">
            <source :src="audioUrl" :type="audioType">
            {{ fallbackMessage }}
        </audio>

        <section class="w-full bg-[#F5EFF7] fixed bottom-0 left-0 h-28 flex justify-between px-6 py-4 gap-16">
            <div class="flex gap-2 items-center">
                <div class="w-12 h-12 rounded-[10px] bg-[#D0BCFF] flex items-center justify-center">
                    <MusicSVG class="w-5 h-5" />
                </div>
                <span>Hello</span>
            </div>

            <div class="flex flex-col items-center justify-center gap-2 flex-grow">
                <div class="flex items-center jusity-center gap-1">
                    <Button class="bg-transparent border-none hover:bg-gray-200">
                        <template #icon>
                            <PreviousSVG class="text-[#49454F]" />
                        </template>
                    </Button>
                    <Button class="bg-[#2C2C2C] border-none hover:bg-gray-200 hover:bg-[#4d4c4c]" @click="playPause">
                        <template #icon>
                            <PlaySVG class="pl-[2px] w-4 h-4 text-white" />
                        </template>
                    </Button>
                    <Button class="bg-transparent border-none hover:bg-gray-200">
                        <template #icon>
                            <NextSVG class="text-[#49454F]" @click="test" />
                        </template>
                    </Button>
                </div>

                <div class="flex items-center w-full gap-6">
                    <span>00:00</span>
                    <Slider v-model="trackProgress" class="w-full" />
                    <span>00:00</span>
                </div>
            </div>

            <div class="flex items-center">
                <Button class="bg-transparent border-none hover:bg-gray-200">
                    <template #icon>
                        <AudioSVG class="w-5 h-5 text-black" />
                    </template>
                </Button>
                <Slider v-model="volume" class="w-24" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import MusicSVG from '~/components/svgs/MusicSVG.vue';
    import PreviousSVG from '~/components/svgs/PreviousSVG.vue';
    import PlaySVG from '~/components/svgs/PlaySVG.vue';
    import NextSVG from '~/components/svgs/NextSVG.vue';

    const props = defineProps({
        audioUrl: { type: String, required: true },
        audioType: { type: String, required: false, default: 'audio/wav' },
        fallbackMessage: { type: String, required: false, default: 'Your browser does not support the audio element.' }
    });

    const isAudioLoaded = ref(false);
    const loadAudio = () => {
        isAudioLoaded.value = true;
    };

    const volume = ref(50);
    const trackProgress = ref(0);
    const isPlaying = ref(false);
    const audio = ref(null);

    const playPause = () => {
        if (isPlaying.value) {
            audio.value.pause();
        } else {
            audio.value.play();
        }
        isPlaying.value = !isPlaying.value;
    };

    const test = () => {
        console.log(audio.value.currentTime)
    }
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