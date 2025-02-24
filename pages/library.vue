<template>
    <div class="p-6 mb-10">       
        <Card class="bg-white">
            <template #content>
                <ButtonsLibraryContainer @action="open_audio_lbry_modal" />
                <AudiosTable 
                    :user-audios="user_audios"
                    :audio-to-play="audio_to_play"
                    :is-audio-loading="is_audio_loading"
                    :is-loading="isFetching"
                    :show-older="show_older"
                    @update:audioToPlay="handle_update_audio_to_play"
                    @update:showOlder="handle_show_older_audios"
                />
            </template>  
        </Card>
        <AudioPlayer @action="handle_player_action" />
    </div>
    <ModalAudioLibrary ref="modalAudioLibrary" />
</template>

<script setup lang="ts">
    const show_older = ref(false)
    const modalAudioLibrary = ref()

    const { data: allAudiosData, isFetching } = useFetchGetAllAudios(show_older)

    const user_audios = computed((): ProcessedAudio[] => {
        if(allAudiosData.value && allAudiosData.value.result) {
            return allAudiosData.value.audios.map((audio: Audio, index: number) => {
                return {
                    ...audio,
                    position: index + 1,
                    created_at: new Date(audio.created_at).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    }),
                    last_used: new Date(audio.last_used).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })
                }
            })
        }
        return []
    })

    const open_audio_lbry_modal = (section: AudioLbryModalSectionToShow) => {
        if(!section) return
        modalAudioLibrary.value.open(section);
    }

    /* ----- Audio Player ----- */
    const { audio_to_play, handle_player_action, is_audio_loading } = useAudioPlayer(user_audios, false)

    const handle_update_audio_to_play = (audio: ProcessedAudio | null) => {
        audio_to_play.value = audio
    }

    const handle_show_older_audios = (value: boolean) => show_older.value = value
    /* ----- Audio Player ----- */
</script>

<style scoped>
    .btn-convert {
        padding: .7rem 1.2rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 1rem;
    }
    textarea {
        display: block;
        margin-bottom: 1rem;
    }
</style>