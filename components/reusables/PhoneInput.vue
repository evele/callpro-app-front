<template>
    <div v-if="!is_international" class="relative w-full flex">
        <InputMask ref="phoneNumberRef" :model-value="localPhoneNumberModel" :invalid="show_phone_number_error || props.numberError.length > 0" @keyup="handleKeyup" @update:model-value="updateLocalPhoneNumberModel"
            mask="(999) 999-9999" :placeholder="props.placeholder" fluid class="w-full py-2 px-4 transition-colors placeholder-grey-7" :class="props.borderRadius"
        />
        <span v-if="show_phone_number_error || props.numberError.length" class="text-red-500 absolute left-0 top-full">{{ props.numberError.length ? props.numberError : 'Invalid area code' }}</span>
    </div>
    
    <div v-else class="relative w-full flex">
        <InputText ref="intPhoneNumberRef" :model-value="localIntPhoneNumberModel" :invalid="show_int_phone_number_error || props.numberError.length > 0" @keyup="handleResetInt" maxlength="20" @update:model-value="updateLocalIntPhoneNumberModel"
            class="w-full py-2 px-4 transition-colors" :class="props.borderRadius" />
        <span v-if="show_int_phone_number_error || props.numberError.length" class="text-red-500 absolute left-0 top-full placeholder-grey-7">{{ props.numberError.length ? props.numberError : 'Invalid phone number' }}</span>
    </div>
</template>

<script setup lang="ts">
    import { useGeneralStore } from '@/stores';

    const props = withDefaults(defineProps<{
        modelValue: string
        numberError?: string
        formAction?: FormAction
        borderRadius?: string
        placeholder?: string
        allowBreakMask?: boolean
    }>(), {
        modelValue: '',
        numberError: '',
        formAction: '' as FormAction,
        borderRadius: 'rounded-[30px]',
        placeholder: '(___) ___ - ____',
        allowBreakMask: false
    })

    const generalStore = useGeneralStore()
    const phoneNumberRef:Ref<HTMLInputElement | null> = ref(null)
    const intPhoneNumberRef:Ref<HTMLInputElement | null> = ref(null)

    const localPhoneNumberModel = ref(props.modelValue);
    const localIntPhoneNumberModel = ref(props.modelValue);
    const is_international = ref(false);
    const show_phone_number_error = ref(false);
    const show_int_phone_number_error = ref(false);
    const number_length = ref(0);

    onMounted(() => {
        if (props.modelValue.startsWith('+') || localPhoneNumberModel.value.replace(/[^0-9]/g, '').length > 10) {
            is_international.value = true;
        }
        number_length.value = localPhoneNumberModel.value.replace(/[^0-9]/g, '').length;
    });

    watch(() => props.formAction, (action: string) => {
        if(action === 'clear') {
            is_international.value = false;
            localIntPhoneNumberModel.value = props.modelValue;
            localPhoneNumberModel.value = props.modelValue;
        }

        if(action === 'fill') {
            if (props.modelValue.startsWith('+')) {
                is_international.value = true;
                localIntPhoneNumberModel.value = props.modelValue;
            } else {
                is_international.value = false;
                localPhoneNumberModel.value = props.modelValue;
            }
        }
    });

    const handleKeyup = (e: KeyboardEvent) => {
        if (e.key === '+') {
            is_international.value = true;
            localPhoneNumberModel.value = '';
            localIntPhoneNumberModel.value = e.key;
            useFocus(intPhoneNumberRef, {initialValue: true})
        } else if(props.allowBreakMask) {
            const cleanPhoneNumber = localPhoneNumberModel.value.replace(/[^0-9]/g, '');
            const isNumber = /^[0-9]+$/

            if(cleanPhoneNumber.length === 10 && cleanPhoneNumber.length === number_length.value && isNumber.test(e.key)) {
                is_international.value = true;
                localPhoneNumberModel.value = '';
                localIntPhoneNumberModel.value = cleanPhoneNumber + e.key;
                useFocus(intPhoneNumberRef, {initialValue: true})
                emit('update:modelValue', localIntPhoneNumberModel.value)
            }

            number_length.value = cleanPhoneNumber.length;
        }
    }

    const handleResetInt = (e: KeyboardEvent) => {
        if (e.key === '+') localIntPhoneNumberModel.value = e.key;
    }

    const emit = defineEmits(["update:modelValue", "hasError"]);

    const updateLocalPhoneNumberModel = (value: string) => {
        localPhoneNumberModel.value = value

        const number_area_code = localPhoneNumberModel.value.substring(1, 4)
        if(localPhoneNumberModel.value === '') {
            show_phone_number_error.value = false;
        } else if(!number_area_code.split('').includes('_')) {
            show_phone_number_error.value = !generalStore.area_codes.some((item: any) => item.area_code === number_area_code);
        }
        if(!is_international.value) {
            emit('update:modelValue', localPhoneNumberModel.value)
            emit('hasError', show_phone_number_error.value)
        }
    }

    const updateLocalIntPhoneNumberModel = (value: string | undefined) => {
        localIntPhoneNumberModel.value = value ?? '';

        if (localIntPhoneNumberModel.value === '') {
            localPhoneNumberModel.value = '';
            is_international.value = false;
            show_int_phone_number_error.value = false;
            useFocus(phoneNumberRef, {initialValue: true})
        } else {
            const regex = /^\+?[0-9]*$/;
            show_int_phone_number_error.value = !regex.test(localIntPhoneNumberModel.value);
        }
        if(is_international.value) {
            emit('update:modelValue', localIntPhoneNumberModel.value)
            emit('hasError', show_int_phone_number_error.value)
        }
    }
</script>