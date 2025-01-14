<template>
    <div>
        <audio ref="audio" type="audio/wav" @timeupdate="update_track_progress">
            Your browser does not support the audio element.
        </audio>
        

        <section v-if="show_controls" class="w-full bg-[#F5EFF7] fixed bottom-0 left-0 flex flex-col sm:flex-row sm:justify-between px-6 py-4 sm:gap-10 z-[1200]">
            <div class="hidden sm:flex gap-2 items-center sm:w-[15%] order-1">
                <div class="w-12 h-12 rounded-[10px] bg-[#D0BCFF] flex items-center justify-center">
                    <MusicSVG class="w-5 h-5" />
                </div>
                <span class="font-semibold text-[#3B383E] text-xs sm:text-sm">{{ current_audio?.name }}</span>
            </div>

            <div class="flex flex-col items-center justify-center gap-2 sm:w-[70%] order-3 sm:order-2">
                <div class="flex items-center jusity-center gap-1">
                    <Button class="bg-transparent border-none" @click="emit('action', 'prev')" :disabled="disabledNextPrev">
                        <template #icon>
                            <PreviousSVG class="text-[#49454F] scale-110 hover:scale-125 hover:text-[#636262] transition-all" />
                        </template>
                    </Button>
                    <Button class="bg-[#2C2C2C] border-none hover:bg-[#636262] hover:scale-105 transition-all" @click="toggle_play_pause">
                        <template v-if="!is_playing" #icon>
                            <PlaySVG class="pl-[2px] w-6 h-6 text-white" />
                        </template>
                        <template v-else #icon>
                            <PauseSVG class="w-5 h-5 text-white" />
                        </template>
                    </Button>
                    <Button class="bg-transparent border-none" @click="emit('action', 'next')" :disabled="disabledNextPrev">
                        <template #icon>
                            <NextSVG class="text-[#49454F] scale-110 hover:scale-125 hover:text-[#636262] transition-all" />
                        </template>
                    </Button>
                </div>

                <div class="flex items-center w-full gap-6">
                    <span class="text-[#79747E] text-sm font-semibold">{{ format_seconds(current_time) }}</span>
                    <Slider v-model="track_progress" @change="handle_track_progress" class="w-full h-2" />
                    <span class="text-[#79747E] text-sm font-semibold">{{ format_seconds(current_audio?.length) }}</span>
                </div>
            </div>

            <div class="flex items-center justify-between sm:justify-center sm:w-[15%] order-2 sm:order-3">
                <div class="flex flex-grow sm:hidden gap-2 items-center">
                    <div class="w-12 h-12 rounded-[10px] bg-[#D0BCFF] flex items-center justify-center">
                        <MusicSVG class="w-5 h-5" />
                    </div>
                    <span class="font-semibold text-[#3B383E] text-xs sm:text-sm">{{ current_audio?.name }}</span>
                </div>

                <Button class="bg-transparent border-none hover:bg-gray-200" @click="toggle_mute_unmute">
                    <template #icon>
                        <AudioMutedSVG v-show="volume === 0" class="w-5 h-5 text-black" />
                        <AudioSVG v-show="volume > 0" class="w-5 h-5 text-black" />
                    </template>
                </Button>
                <Slider v-model="volume" class="w-24 h-[5px]" @change="handle_change_volume" />
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
        currentAudio: {
            type: Object as PropType<Audio | null>,
            required: false,
            default: null
        },
        disabledNextPrev: {
            type: Boolean,
            required: false,
            default: false
        }
    });

    const emit = defineEmits(['action']);

    const audio = ref<HTMLAudioElement | null>(null);
    const current_audio = computed(() => props.currentAudio);
    const show_controls = ref(false);

    const volume = ref(50);
    const last_volume = ref(volume.value);
    const track_progress = ref(0);
    const current_time = ref(0);
    const is_playing = ref(false);

    watch(() => current_audio.value, async (newAudio: Audio | null) => {

        if (newAudio && audio.value) {
            emit('action', 'loading')
            audio.value.src = newAudio.full_file_url;
            is_playing.value = false;

            try {
                await audio.value.play();
                is_playing.value = true;
                show_controls.value = true;
                emit('action', 'play')
            } catch {
                is_playing.value = false;
                show_controls.value = false;
                emit('action', 'error');
            }
        } else {
            is_playing.value = false;
            show_controls.value = false;
            audio?.value?.pause()
        }
    });

    const toggle_play_pause = () => {
        if(audio.value === null) return;

        if(is_playing.value) {
            audio.value.pause() 
            emit('action', 'pause')
        } else {
            audio.value.play()
            emit('action', 'play')
        }
        is_playing.value = !is_playing.value;
    };

    const update_track_progress = () => {
        if (audio.value) {
            current_time.value = audio.value.currentTime;
            track_progress.value = (audio.value.currentTime / audio.value.duration) * 100;
        }
    };

    const handle_track_progress = (value: number) => {
        if (audio.value) {
            audio.value.currentTime = (value / 100) * audio.value.duration;
        }
    };

    const toggle_mute_unmute = () => {
        if (audio.value) {
            if (audio.value.volume === 0) {
                audio.value.volume = last_volume.value / 100;
                volume.value = last_volume.value;
            } else {
                last_volume.value = volume.value;
                audio.value.volume = 0;
                volume.value = 0;
            }
        }
    };

    const handle_change_volume = () => {
        if (audio.value) {
            audio.value.volume = volume.value / 100;
        }
    };
</script>

<style scoped lang="scss">
::v-deep(.p-slider) {
    background-color: #B2B2B2;

    .p-slider-range {
        background-color: #2C2C2C;
        border-radius: 6px;
    }

    .p-slider-handle {
        opacity: 0;
    }

    &:hover .p-slider-handle {
        opacity: 1;
    }
}
</style>