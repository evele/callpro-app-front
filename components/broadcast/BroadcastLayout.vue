<template>
    <div class="bg-white rounded-2xl mt-4 mb-6 shadow-lg container">
        <!----- Header section ----->
        <div class="header h-24 border-b border-grey-6 flex items-center justify-between px-10 flex-wrap">
            <h3 class="text-[22px] font-semibold text-black">{{ current_step_title }}</h3>

            <Transition name="fade" mode="out-in">
                <Button
                    v-if="current_step === 1"
                    type="button" 
                    class="bg-transparent text-dark-3 hover:bg-dark-3 hover:text-white border-grey-14 font-bold h-10"
                >
                    <UploadAudioSVG class="w-4 h-4" />
                    Load last draft
                </Button>

                <Button 
                    v-else
                    type="button" 
                    class="bg-transparent text-dark-3 hover:bg-dark-3 hover:text-white border-grey-14 font-bold h-10"
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
                <Button v-if="current_step > 1" @click="broadcastStore.goPrevStep" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[200px] hover:bg-dark-3 hover:text-white">
                    <ArrowLeftSVG class="w-4 h-4 mr-[6px]" />
                    Go back
                </Button>
                <Button v-if="current_step > 1" @click="handle_save_draf" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[200px] hover:bg-dark-3 hover:text-white">
                    Save draft
                </Button>
                <Button v-if="current_step < 5" @click="broadcastStore.goNextStep" class="bg-[#653494] border-white text-white w-full sm:max-w-[200px] hover:bg-[#4A1D6E]">
                    Next
                    <ArrowRightSVG class="w-5 h-5 ml-[6px]" />
                </Button>
                <Button v-if="current_step === 5" @click="handle_confirm_broadcast" class="bg-[#653494] border-white text-white w-full sm:max-w-[200px] hover:bg-[#4A1D6E]">
                    Confirm broadcast
                </Button>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
    const broadcastStore = useBroadcastStore();
    const { current_step } = storeToRefs(broadcastStore)
    const show_advanced_features = ref<boolean>(false)

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
</style>