<template>
    <div>
        <ul v-if="audios.length" class="ml-2">
            <li v-for="audio in audios" :key="audio.id" class="mb-2 flex gap-2 items-center">
                <span>{{ audio.name }}</span>
                <Button @click="select_audio(audio.id)" class="bg-transparent border-none text-black p-1 hover:bg-gray-300">
                    <AudioSVG />            
                </Button>
                <span v-if="is_loading && selected_audio?.full_file_url === audio.full_file_url">Loading...</span>
                <span v-else-if="is_error && selected_audio?.full_file_url === audio.full_file_url">This audio can't be played</span>
                <span v-if="is_playing && selected_audio?.full_file_url === audio.full_file_url">Playing...</span>
            </li>
        </ul>

        <audio ref="audio" type="audio/wav" @timeupdate="update_track_progress">
            Your browser does not support the audio element.
        </audio>
        

        <section v-if="show_controls" class="w-full bg-[#F5EFF7] fixed bottom-0 left-0 h-28 flex justify-between px-6 py-4 gap-10">
            <div class="flex gap-2 items-center w-[15%]">
                <div class="w-12 h-12 rounded-[10px] bg-[#D0BCFF] flex items-center justify-center">
                    <MusicSVG class="w-5 h-5" />
                </div>
                <span v-if="!is_error">{{ selected_audio?.name }}</span>
                <span v-else>Error!</span>
            </div>

            <div class="flex flex-col items-center justify-center gap-2 w-[70%]">
                <div class="flex items-center jusity-center gap-1">
                    <Button class="bg-transparent border-none hover:bg-gray-200">
                        <template #icon>
                            <PreviousSVG class="text-[#49454F]" @click="handle_prev_song" />
                        </template>
                    </Button>
                    <Button class="bg-[#2C2C2C] border-none hover:bg-[#4d4c4c]" @click="toggle_play_pause">
                        <template v-if="is_playing" #icon >
                            <PlaySVG class="pl-[2px] w-4 h-4 text-white" />
                        </template>
                        <template v-else #icon>
                            <PauseSVG class="pl-[2px] w-5 h-5 text-white" />
                        </template>
                    </Button>
                    <Button class="bg-transparent border-none hover:bg-gray-200">
                        <template #icon>
                            <NextSVG class="text-[#49454F]" @click="handle_next_song" />
                        </template>
                    </Button>
                </div>

                <div class="flex items-center w-full gap-6">
                    <span>{{ format_seconds(current_time) }}</span>
                    <Slider v-model="track_progress" @change="handle_track_progress" class="w-full" />
                    <span>{{ format_seconds(selected_audio.length) }}</span>
                </div>
            </div>

            <div class="flex items-center justify-center w-[15%]">
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
        audios: {
            type: Array as PropType<Audio[]>,
            required: true
        }
    });

    const audio = ref<HTMLAudioElement | null>(null);
    const selected_audio = ref<Audio | undefined>(undefined);
    const is_error = ref(false);
    const is_loading = ref(false);
    const show_controls = ref(false);

    const volume = ref(50);
    const track_progress = ref(0);
    const current_time = ref(0);
    const is_playing = ref(false);

    const select_audio = async (id: string) => {
        if (audio.value) {
            selected_audio.value = props.audios.find((audio: Audio) => audio.id === id);
            if (!selected_audio.value) {
                is_error.value = true;
                is_playing.value = false;
                return
            }
            show_controls.value = true;
            is_playing.value = false;
            is_loading.value = true;
            is_error.value = false;

            audio.value.src = selected_audio.value.full_file_url;
            try {
                await audio.value.play();
                is_playing.value = true;
            } catch (error) {
                is_error.value = true;
                is_playing.value = false;
                show_controls.value = false;
            }
        }
        is_loading.value = false;
    }

    const toggle_play_pause = () => {
        if(audio.value === null) return;

        if (is_playing.value) {
            audio.value.pause();
        } else {
            audio.value.play();
        }
        is_playing.value = !is_playing.value;
    };

    const handle_prev_song = () => {
        const current_index = props.audios.findIndex((audio: Audio) => audio.id === selected_audio.value?.id);
        if (current_index === 0) {
            select_audio(props.audios[props.audios.length - 1].id);
        } else {
            select_audio(props.audios[current_index - 1].id);
        }
    };

    const handle_next_song = () => {
        const current_index = props.audios.findIndex((audio: Audio) => audio.id === selected_audio.value?.id);
        if (current_index === props.audios.length - 1) {
            select_audio(props.audios[0].id);
        } else {
            select_audio(props.audios[current_index + 1].id);
        }
    };

    watch(volume, (newVolume: number) => {
        if (audio.value) {
            audio.value.volume = newVolume / 100;
        }
    });

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
</script>