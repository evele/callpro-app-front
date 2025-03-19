<template>
    <div class="bg-white rounded-2xl mt-4 mb-6 shadow-lg container">
        <!----- Header section ----->
        <div class="header h-24 border-b border-grey-6 flex items-center justify-between px-10 flex-wrap">
            <h3 class="text-[22px] font-semibold text-black">{{ current_step_title }}</h3>

            <Transition name="fade" mode="out-in">
                <Button
                    v-if="current_step === 1 && !has_loaded_draft"
                    type="button" 
                    class="bg-transparent text-dark-3 hover:bg-dark-3 hover:text-white border-grey-14 font-bold h-10 disabled:bg-transparent disabled:text-dark-3"
                    :disabled="is_saving_draft || !last_draft_id"
                    @click="broadcastStore.loadLastDraft(last_draft_id)"
                >
                    <UploadAudioSVG class="w-4 h-4" />
                    Load last draft
                </Button>

                <Button 
                    v-else
                    type="button" 
                    class="bg-transparent text-dark-3 hover:bg-dark-3 hover:text-white border-grey-14 font-bold h-10"
                    :disabled="is_saving_draft"
                >
                    <RotateSVG class="w-4 h-4" />
                    Reset broadcast
                </Button>
            </Transition>
        </div>

        <!----- Steps section ----->
        <div class="bg-[#F5F5F5] max-w-[280px] border-r border-l border-grey-6 rounded-tl-2xl rounded-bl-2xl px-10 py-20 sidebar">
            <BroadcastSteps />
        </div>

        <!----- Content section ----->
        <div class="body flex flex-col justify-between py-8 px-8 min-h-[630px]">
            <Transition name="fade" mode="out-in">
                <TitleStep v-if="current_step === 1" />
                <TimeStep v-else-if="current_step === 2" />
                <div v-else >Under construction</div>
            </Transition>

            <footer class="flex flex-col w-full justify-between gap-4 sm:gap-6 font-bold mt-7 sm:flex-row">
                <Button v-if="current_step === 1" @click="toggle_advanced_features" class="bg-transparent border-none w-fit underline text-primary text-sm hover:text-primary/80">
                    Show advanced features
                </Button>
                <Button v-if="current_step > 1" @click="broadcastStore.goPrevStep" :disabled="is_saving_draft"
                    class="bg-[#F5F5F5] border text-black w-full sm:max-w-[200px] hover:bg-dark-3 hover:text-white">
                    <ArrowLeftSVG class="w-4 h-4 mr-[6px]" />
                    Go back
                </Button>
                <Button v-if="current_step > 1" @click="handle_save_draf" :disabled="is_saving_draft"
                    class="bg-[#F5F5F5] border text-black w-full sm:max-w-[200px] hover:bg-dark-3 hover:text-white">
                    Save draft
                </Button>
                <Button v-if="current_step < 5" @click="broadcastStore.goNextStep" :disabled="is_saving_draft"
                    class="bg-[#653494] border-white text-white w-full sm:max-w-[200px] hover:bg-[#4A1D6E]">
                    Next
                    <ProgressSpinner v-if="is_saving_draft" strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner ml-3 mr-0" animationDuration=".5s" aria-label="saving draft" />
                    <ArrowRightSVG v-else class="w-5 h-5 ml-[6px]" />
                </Button>
                <Button v-if="current_step === 5" @click="handle_confirm_broadcast" :disabled="is_saving_draft"
                    class="bg-[#653494] border-white text-white w-full sm:max-w-[200px] hover:bg-[#4A1D6E]">
                    Confirm broadcast
                </Button>
            </footer>
        </div>
    </div>

    <Toast />

    <Dialog v-model:visible="is_loading_draft" :draggable="false" :closable="false"
            pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-[300px]" pt:mask:class="bg-white bg-opacity-40 backdrop-blur-[1px]"
        >
            <template #container>
                <div class="flex items-center gap-6 p-10">
                    <p class="font-bold text-xl text-grey-main">Loading draft...</p>
                    <ProgressSpinner strokeWidth="6" fill="transparent" class="h-10 w-10 dark-spinner" animationDuration=".5s" aria-label="Loading broadcast" />
                </div>
            </template>
        </Dialog>
</template>

<script setup lang="ts">
    const broadcastStore = useBroadcastStore();
    const { current_step, toast_error, is_saving_draft, is_loading_draft, has_loaded_draft } = storeToRefs(broadcastStore)
    const show_advanced_features = ref<boolean>(false)
    const { show_error_toast } = usePrimeVueToast();
    const { data: lastDraftID } = useFetchGetLastDraftID()

    const last_draft_id = computed(() => {
        if(!lastDraftID?.value?.result) return null
        return lastDraftID?.value?.draft_id
    })

    const current_step_title = computed(() => {
        switch (current_step.value) {
            case 1:
                return 'Name your Broadcast'
            case 2:
                return 'Set the broadcasting time'
            case 3:
                return 'Select the broadcast receivers'
            case 4:
                return 'Select your Audio'
            case 5:
                return 'Confirm your broadcast'
            default:
                return ''
        }
    })

    const handle_save_draf = () => {
        console.log('Save draft')
    }

    const toggle_advanced_features = () => {
        show_advanced_features.value = !show_advanced_features.value
        console.log(show_advanced_features.value)
    }

    const handle_confirm_broadcast = () => {
        console.log('confirm broadcast')
    }

    watch(() => toast_error.value, (newVal: { state: boolean, message: string }) => {
        if (newVal.state) show_error_toast('Error', newVal.message)
    })
</script>

<style scoped lang="scss">
    .header { 
        grid-area: header;
    }
    .sidebar { grid-area: steps; }
    .body { 
        grid-area: main;
    }

    .container {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr;
        grid-template-areas:
            'steps header'
            'steps main';
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    :deep(.light-spinner) {
        .p-progressspinner-circle {
            stroke: white!important;
        }
    }

    :deep(.dark-spinner) {
        .p-progressspinner-circle {
            stroke: #49454F!important;
        }
    }
</style>