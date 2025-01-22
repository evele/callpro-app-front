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
                    <span class="leading-snug">{{ format_number_to_show(slotProps.value.caller_id) }}</span>
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

    const localModelValue = ref<CallerIDExt | null>(null);
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

    const existsInCallerIdNumbers = (callerId: string | null | CallerIDExt ) => {
        if(!callerId) return false;
        if(typeof callerId === 'object') {
            return formatted_caller_id_numbers.value.some((item: CallerIDExt) => item.caller_id === callerId?.caller_id);
        }
        return formatted_caller_id_numbers.value.some((item: CallerIDExt) => item.caller_id === callerId);
    }

    const emit_error = (message: string) => {
        error_message.value = message;
        emit('update:error', true);
    }

    const find_number_to_show = () => {
        localModelValue.value = formatted_caller_id_numbers.value.find((item: CallerIDExt) => item.caller_id === props.modelValue) || formatted_caller_id_numbers.value[0];
    }

    watch(() => localModelValue.value, () => {
        if(!localModelValue.value?.caller_id) return;
        if(localModelValue.value?.status !== CallerIDStatus.CONFIRMED) {
            emit_error('You need a verified number to send a new broadcast')
        } else {
            error_message.value = '';
            emit('update:error', false);
        }
        emit('update:modelValue', localModelValue.value)
    });

    watch(
        () => ({ isLoading: props.isLoading, modelValue: props.modelValue }),
        ({ isLoading, modelValue }: { isLoading: boolean, modelValue: string}) => {
            if (isLoading) return

            if (!modelValue || !existsInCallerIdNumbers(modelValue)) {
                emit_error('Caller ID is required')
            } else {
                find_number_to_show()
            }
        },
        { immediate: true }
    );
</script>

<style scoped lang="scss">
    :deep(.p-select) {
        .p-select-label {
            padding-right: 0;
        }
    }
</style>