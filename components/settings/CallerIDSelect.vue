<template>
    <div class="relative">
        <Select 
            v-model="localModelValue" 
            :options="formatted_caller_id_numbers"
            optionLabel="caller_id"
            class="w-[294px] h-[38px]" 
            :placeholder="isLoading ? 'Loading...' : 'Select number'" 
            :loading="isLoading"
            :invalid="error_message.length > 0"
        >
            <template #value="slotProps">
                <div v-if="slotProps.value && existsInCallerIdNumbers(localModelValue)" class="flex items-center w-full justify-between">
                    <span>{{ format_number_to_show(slotProps.value.caller_id) }}</span>
                    <VerifiedSVG v-if="slotProps.value.status === CallerIDStatus.CONFIRMED" class="w-4 h-4 text-verified" />
                    <PendingSVG v-if="slotProps.value.status === CallerIDStatus.PENDING || slotProps.value.status === CallerIDStatus.UNVERIFIED" class="w-4 h-4 text-pending" />
                    <RejectedSVG v-if="slotProps.value.status === CallerIDStatus.REJECTED" class="w-4 h-4 text-unverified" />
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>

            <template #option="slotProps">
                <div class="flex items-center w-full justify-between">
                    <div>{{ format_number_to_show(slotProps.option.caller_id) }}</div>
                    <VerifiedSVG v-if="slotProps.option.status === CallerIDStatus.CONFIRMED" class="w-4 h-4 text-verified" />
                    <PendingSVG v-if="slotProps.option.status === CallerIDStatus.PENDING || slotProps.option.status === CallerIDStatus.UNVERIFIED" class="w-4 h-4 text-pending" />
                    <RejectedSVG v-if="slotProps.option.status === CallerIDStatus.REJECTED" class="w-4 h-4 text-unverified" />
                </div>
            </template>
        </Select>
        <span v-if="error_message.length" class="text-[12px] text-red-500 absolute left-1 -bottom-6">{{ error_message }}</span>
    </div>
</template>

<script setup lang="ts">
    import VerifiedSVG from '../svgs/VerifiedSVG.vue'
    import PendingSVG from '../svgs/PendingSVG.vue'
    import RejectedSVG from '../svgs/RejectedSVG.vue'

    const props = defineProps<{
        modelValue: string;
        isLoading: boolean;
        callerIdNumbers: CallerID[];
    }>();
    
    const emit = defineEmits(['update:modelValue', 'update:error']);

    const localModelValue = ref<string | CallerID>('');
    const error_message = ref<string>('');

    const statusPriority = {
        [CallerIDStatus.CONFIRMED]: 1,
        [CallerIDStatus.PENDING]: 2,
        [CallerIDStatus.UNVERIFIED]: 3,
        [CallerIDStatus.REJECTED]: 4
    }

    const formatted_caller_id_numbers = computed((): CallerIDExt[] => {
        return [...props.callerIdNumbers]
                    .sort((a: CallerID, b: CallerID) => statusPriority[a.status] - statusPriority[b.status])
                    .map((item: CallerID) => {
                        return {
                            ...item,
                            caller_id: item.caller_id.split('#')[0],
                            ext: item.caller_id.split('#')[1] || ''
                        }
                    })
    })

    const existsInCallerIdNumbers = (callerId: string | CallerIDExt) => {
        if(typeof callerId === 'object') {
            return formatted_caller_id_numbers.value.some((item: CallerIDExt) => item.caller_id === callerId?.caller_id);
        }
        return formatted_caller_id_numbers.value.some((item: CallerIDExt) => item.caller_id === callerId);
    }

    onMounted(() => {
        if(!props.isLoading) {
            if(!props.modelValue) {
                error_message.value = 'Caller ID is required';
                emit('update:error', true)
            } else {
                localModelValue.value = formatted_caller_id_numbers.value.find((item: CallerIDExt) => item.caller_id === props.modelValue);
            }
        }
    })

    watch(() => props.isLoading, () => {
        if(!props.isLoading) {
            if(!existsInCallerIdNumbers(props.modelValue)) {
                error_message.value = 'Caller ID is required';
                emit('update:error', true)
            } else {
                localModelValue.value = formatted_caller_id_numbers.value.find((item: CallerIDExt) => item.caller_id === props.modelValue);
            }
        }
    })

    watch(() => localModelValue.value, () => {
        if(typeof localModelValue.value === 'string' || !localModelValue.value?.caller_id) return;
        if(localModelValue.value?.status !== CallerIDStatus.CONFIRMED) {
            error_message.value = 'You need a verified number to send a new broadcast';
            emit('update:error', true);
        } else {
            error_message.value = '';
            emit('update:error', false);
        }
        emit('update:modelValue', localModelValue.value)
    });

    watch(() => props.modelValue, () => {
        if(!props.modelValue) {
            error_message.value = 'Caller ID is required';
            emit('update:error', true)
        }
    })
</script>