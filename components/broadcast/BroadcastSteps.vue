
<template>
    <Stepper v-model:value="current_step" class="basis-[40rem] relative" linear>
        <StepList>
            <Step v-slot="{ value }" asChild :value="1">
                <div class="flex flex-col items-center">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700"
                        @click="broadcastStore.goToStep(value)"
                    >
                        <div 
                            class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors duration-300"
                            :class="[current_step === value ? 'text-white bg-[#6750A4] border-grey-6' : 'bg-white text-grey-secondary border-grey-5' ]"    
                        >
                            <PenToolSVG class="h-5 w-5" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors duration-300"
                            :class="[current_step === value ? 'text-[#6750A4]': 'text-grey-secondary' ]"  
                        >
                            Title
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ value }" asChild :value="2">
                <div class="flex flex-col items-center">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="broadcastStore.goToStep(value)"
                        :disabled="completed_steps < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors duration-300"
                        :class="get_step_class(Number(value))"  
                    >
                            <ClockSVG class="h-[22px] w-[22px]" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors duration-300"
                            :class="[current_step === value ? 'text-[#6750A4]': 'text-grey-secondary', completed_steps < Number(value) ? 'opacity-50': '' ]"  
                        >
                            Time
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ value }" asChild :value="3">
                <div class="flex flex-col items-center">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="broadcastStore.goToStep(value)"
                        :disabled="completed_steps < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors duration-300"
                        :class="get_step_class(Number(value))"   
                    >
                            <BookSVG class="h-5 w-5" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors duration-300"
                            :class="[current_step === value ? 'text-[#6750A4]': 'text-grey-secondary', completed_steps < Number(value) ? 'opacity-50': '' ]"  
                        >
                            Numbers
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ value }" asChild :value="4">
                <div class="flex flex-col items-center">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="broadcastStore.goToStep(value)"
                        :disabled="completed_steps < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 min-w-10 min-h-10 flex items-center justify-center z-10 transition-colors duration-300"
                        :class="get_step_class(Number(value))"   
                    >
                            <AudioSVG class="h-[22px] w-[22px]" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors duration-300"
                            :class="[current_step === value ? 'text-[#6750A4]': 'text-grey-secondary', completed_steps < Number(value) ? 'opacity-50': '' ]"  
                        >
                            Select your Audio
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ value }" asChild :value="5">
                <div class="flex flex-col items-center">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="broadcastStore.goToStep(value)"
                        :disabled="completed_steps < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors duration-300"
                        :class="get_step_class(Number(value))"    
                    >
                            <CheckCircleSVG class="h-5 w-5" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors duration-300"
                            :class="[current_step === value ? 'text-[#6750A4]': 'text-grey-secondary', completed_steps < Number(value) ? 'opacity-50': '' ]"  
                        >
                            Confirmation
                        </span>
                    </Button>
                </div>
            </Step>
        </StepList>
        <div class="h-[330px] bg-grey-6 w-[1px] absolute top-4 left-6" />
    </Stepper>
</template>

<script setup lang="ts">
const broadcastStore = useBroadcastStore();
const { current_step, completed_steps } = storeToRefs(broadcastStore)

const get_step_class = (value: number) => {
    if(current_step.value === value) {
        return 'text-white bg-[#6750A4] border-grey-6';
    } else if(completed_steps.value < value) {
        return 'bg-white border-grey-6 text-grey-6';
    } else {
        return 'bg-white text-grey-secondary border-grey-5';
    }
}
</script>

<style scoped lang="scss">
    :deep(.p-steplist) {
        flex-direction: column;
        align-items: flex-start;
        gap: 36px;
    }
</style>