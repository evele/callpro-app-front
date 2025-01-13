<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-5 px-8">
                <h2 class="flex items-center gap-4 font-bold text-2xl text-black">Select Static Intro</h2>
                <Button @click="handle_close_modal" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <div class="flex justify-between w-full">
            <IconField>
                <InputIcon>
                    <SearchSVG class="text-[#757575]" />
                </InputIcon>
                <InputText v-model="search" placeholder="Search by Name" class="max-w-56" />
            </IconField>

            <div class="flex items-center gap-4">
                <Button class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg">
                    <UploadAudioSVG class="text-[#757575] w-5 h-5" />
                    <span class="font-semibold text-sm">Upload audio file</span>
                </Button>

                <Button class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-[#e6e2e2] border-none hover:shadow-lg">
                    <TextSVG class="text-[#757575] w-5 h-5" />
                    <span class="font-semibold text-sm">Add new TTS</span>
                </Button>
            </div>
        </div>

        <ProgressBar v-if="isFetching" mode="indeterminate" style="height: 6px"></ProgressBar>
        <div v-if="user_audios" class="w-full max-h-[310px] overflow-y-auto mt-10 rounded-tl-xl rounded-tr-xl">
            <table class="w-full text-gray-700 border border-gray-200 border-collapse">
                <thead class="sticky -top-[1px] z-[100] bg-[#e9e9e9]">
                    <tr class="bg-[#e9e9e9] h-[38px] text-[#1D1B20] font-medium border-b border-gray-300">
                        <th class="px-8 w-20"></th>
                        <th class="px-4 text-left text-sm font-medium">Name</th>
                        <th class="px-4 text-center text-sm font-medium">Play</th>
                        <th class="px-4 text-center text-sm font-medium">Edit</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-if="user_audios.length"
                        v-for="(audio, index) in user_audios"
                        :key="audio.id"
                        class="pt-4 pb-[15px] h-[70px] odd:bg-[#f4f4f4] even:bg-white"
                    >
                        <td class="text-center">
                            <Checkbox
                                v-model="selected_audio_checkbox"
                                :inputId="'audio-' + audio.id"
                                :value="audio.id"
                                @click="handle_audio_selection(audio.id)"
                            />
                        </td>
                        <td>{{ audio.name }}</td>
                        <td class="text-center">
                            <Button class="bg-primary p-0 hover:scale-110 transition-transform" @click="console.log('play')">
                                <PlaySVG class="w-7 h-7 text-white" />
                            </Button>
                        </td>
                        <td class="text-center">
                            <Button
                                @click="handle_open_edit_audio_modal(audio)"
                                class="w-7 h-7 bg-[#e7e0ec] rounded-full text-[#1D1B20] border-none hover:scale-110 transition-transform"
                            >
                                <template #icon>
                                    <EditIconSVG class="w-4 h-4 relative bg-[#e7e0ec] rounded-[10px]" />
                                </template>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <template #footer>
            <footer class="flex justify-center w-full font-bold mt-[38px]">
                <Button @click="handle_save" class="w-[300px]">
                    Save
                </Button>
            </footer>
        </template>
    </Dialog>

    <ConfirmationModal ref="confirmationModal" title="Edit Audio Name" @confirm="handle_edit_audio" @cancel="handle_close_edit_audio_modal">
        <div class="flex flex-col w-full gap-1">
            <label for="audio-name" class="text-lg text-black">Audio Name</label>
            <InputText type="text" id="audio-name" v-model="audio_name" placeholder="Enter Name" />
        </div>
    </ConfirmationModal>
</template>

<script setup lang="ts">
    import PlaySVG from '../svgs/PlaySVG.vue'
    import EditIconSVG from '../svgs/EditIconSVG.vue'
    import UploadAudioSVG from '../svgs/UploadAudioSVG.vue'

    const visible = ref(false)
    const show_older = ref(true)

    const { data: allAudiosData, isFetching, isSuccess } = useFetchGetAllAudios(show_older)

    const user_audios = computed(() => {
        if(allAudiosData.value && allAudiosData.value.result) {
            return allAudiosData.value.audios
        }
        return []
    })

    const selected_audio_checkbox = ref<number[]>([])
    const selected_audio_to_edit = ref<Audio | null>(null)
    const search = ref('')
    const confirmationModal = ref()
    const audio_name = ref('')

    const open = (selected_audio_id: number) => {
        console.log(selected_audio_id)
        visible.value = true;
    }

    const close = () => {
        visible.value = false;
    }

    const handle_close_modal = () => {
        close()
    }

    const handle_save = () => {
        console.log('aca el save')
    }

    defineExpose({ open })

    const handle_audio_selection = (value: number) => {
        console.log(value)
        console.log(selected_audio_checkbox.value)
    }

    const handle_open_edit_audio_modal = (audio: Audio) => {
        if(audio.id) {
            selected_audio_to_edit.value = audio
            audio_name.value = audio.name
            confirmationModal.value.open()
        }
    }

    const handle_close_edit_audio_modal = () => {
        selected_audio_to_edit.value = null
        audio_name.value = ''
    }

    const handle_edit_audio = () => {
        console.log('edit audio')
    }
</script>