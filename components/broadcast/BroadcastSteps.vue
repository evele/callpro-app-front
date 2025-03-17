
<template>
    <Stepper v-model:value="active_step" class="basis-[40rem] relative" linear>
        <StepList>
            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
                <div class="flex flex-col items-center" v-bind="a11yAttrs.root">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700"
                        @click="activateCallback" 
                        v-bind="a11yAttrs.header"
                    >
                        <div 
                            class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors"
                            :class="[active_step === value ? 'text-white bg-[#6750A4] border-grey-6' : 'bg-white text-grey-secondary border-grey-5' ]"    
                        >
                            <PenToolSVG class="h-5 w-5" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors"
                            :class="[active_step === value ? 'text-[#6750A4]': 'text-grey-secondary' ]"  
                        >
                            Title
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
                <div class="flex flex-col items-center" v-bind="a11yAttrs.root">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="activateCallback" 
                        v-bind="a11yAttrs.header"
                        :disabled="active_step < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors"
                        :class="get_step_class(Number(value))"  
                    >
                            <ClockSVG class="h-[22px] w-[22px]" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors"
                            :class="[active_step === value ? 'text-[#6750A4]': 'text-grey-secondary', active_step < Number(value) ? 'opacity-50': '' ]"  
                        >
                            Time
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="3">
                <div class="flex flex-col items-center" v-bind="a11yAttrs.root">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="activateCallback" 
                        v-bind="a11yAttrs.header"
                        :disabled="active_step < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors"
                        :class="get_step_class(Number(value))"   
                    >
                            <BookSVG class="h-5 w-5" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors"
                            :class="[active_step === value ? 'text-[#6750A4]': 'text-grey-secondary', active_step < Number(value) ? 'opacity-50': '' ]"  
                        >
                            Numbers
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="4">
                <div class="flex flex-col items-center" v-bind="a11yAttrs.root">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="activateCallback" 
                        v-bind="a11yAttrs.header"
                        :disabled="active_step < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 min-w-10 min-h-10 flex items-center justify-center z-10 transition-colors"
                        :class="get_step_class(Number(value))"   
                    >
                            <AudioSVG class="h-[22px] w-[22px]" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors"
                            :class="[active_step === value ? 'text-[#6750A4]': 'text-grey-secondary', active_step < Number(value) ? 'opacity-50': '' ]"  
                        >
                            Select your Audio
                        </span>
                    </Button>
                </div>
            </Step>
            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="5">
                <div class="flex flex-col items-center" v-bind="a11yAttrs.root">
                    <Button 
                        class="bg-transparent border-none rounded-none px-1 py-[2px] text-grey-secondary hover:text-gray-700 disabled:opacity-100" 
                        @click="activateCallback" 
                        v-bind="a11yAttrs.header"
                        :disabled="active_step < Number(value)"
                    >
                    <div 
                        class="rounded-lg border-2 w-10 h-10 flex items-center justify-center z-10 transition-colors"
                        :class="get_step_class(Number(value))"    
                    >
                            <CheckCircleSVG class="h-5 w-5" />
                        </div>
                        <span 
                            class="font-semibold ml-2 transition-colors"
                            :class="[active_step === value ? 'text-[#6750A4]': 'text-grey-secondary', active_step < Number(value) ? 'opacity-50': '' ]"  
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
const props = defineProps<{
    activeStep: number
}>();

const emit = defineEmits<{
    'update:activeStep': [value: number],
}>()

const active_step = ref<number>(props.activeStep);

watch(() => props.activeStep, (newVal: number) => {
    active_step.value = newVal;
});

watch(active_step, (newVal: number) => {
    emit('update:activeStep', newVal);
});

const get_step_class = (value: number) => {
    if(active_step.value === value) {
        return 'text-white bg-[#6750A4] border-grey-6';
    } else if(active_step.value < value) {
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