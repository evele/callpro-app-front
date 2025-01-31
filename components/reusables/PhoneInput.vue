<template>
    <div v-if="!is_international" class="relative w-full flex">
        <InputMask ref="phoneNumberRef" :model-value="localPhoneNumberModel" :invalid="show_phone_number_error || numberError.length > 0" @keyup="handleKeyup" @update:model-value="updateLocalPhoneNumberModel"
        mask="(999) 999-9999" placeholder="(___) ___ - ____" fluid class="w-full py-2 px-4 transition-colors" :class="borderRadius"
        />
        <span v-if="show_phone_number_error || numberError.length" class="text-red-500 absolute left-0 top-full">{{ numberError.length ? numberError : 'Invalid area code' }}</span>
    </div>
    
    <div v-else class="relative w-full flex">
        <InputText ref="intPhoneNumberRef" :model-value="localIntPhoneNumberModel" :invalid="show_int_phone_number_error || numberError.length > 0" maxlength="20" @update:model-value="updateLocalIntPhoneNumberModel"
            class="w-full py-2 px-4 transition-colors" :class="borderRadius" />
        <span v-if="show_int_phone_number_error || numberError.length" class="text-red-500 absolute left-0 top-full">{{ numberError.length ? numberError : 'Invalid phone number' }}</span>
    </div>
</template>

<script setup lang="ts">
    import { useGeneralStore } from '@/stores';

    const props = defineProps({
        modelValue: { type: String, default: '' },
        numberError: { type: String, required: false, default: '' },
        formAction: { type: String, required: false, default: '' },
        borderRadius: { type: String, required: false, default: 'rounded-[30px]' }
    });

    onMounted(() => {
        if (props.modelValue.startsWith('+')) {
            is_international.value = true;
        }
    });

    const generalStore = useGeneralStore()
    const phoneNumberRef:Ref<HTMLInputElement | null> = ref(null)
    const intPhoneNumberRef:Ref<HTMLInputElement | null> = ref(null)

    const localPhoneNumberModel = ref(props.modelValue);
    const localIntPhoneNumberModel = ref(props.modelValue);
    const is_international = ref(false);
    const show_phone_number_error = ref(false);
    const show_int_phone_number_error = ref(false);

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
        }
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
        emit('update:modelValue', localPhoneNumberModel.value)
        emit('hasError', show_phone_number_error.value)
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
        emit('update:modelValue', localIntPhoneNumberModel.value)
        emit('hasError', show_int_phone_number_error.value)
    }
</script>