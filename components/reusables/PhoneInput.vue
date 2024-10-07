<template>
    <div v-if="!is_international" class="w-full">
        <InputMask ref="phoneNumberRef" :model-value="localPhoneNumberModel" :invalid="show_phone_number_error" @focus="init_event" @blur="stop_event" @update:model-value="updateLocalPhoneNumberModel"
        mask="(999) 999-9999" placeholder="(___) ___ - ____" fluid class="w-full py-2 px-4 rounded-[30px] transition-colors" 
        />
        <span v-if="show_phone_number_error" class="text-red-500 text-sm">Invalid area code</span>
    </div>
    
    <div v-else class="w-full">
        <InputText ref="intPhoneNumberRef" :model-value="localIntPhoneNumberModel" :invalid="show_int_phone_number_error" maxlength="20" @update:model-value="updateLocalIntPhoneNumberModel"
            class="w-full py-2 px-4 rounded-[30px] transition-colors" />
        <span v-if="show_int_phone_number_error" class="text-red-500 text-sm">Invalid phone number</span>
    </div>
</template>

<script setup lang="ts">
    import { useGeneralStore } from '@/stores';

    const props = defineProps({
        modelValue: { type: String, default: '' },
    });

    onMounted(() => {
        if (props.modelValue.startsWith('+')) {
            is_international.value = true;
        }
    });

    const generalStore = useGeneralStore();
    const phoneNumberRef = ref<any>(null);
    const intPhoneNumberRef = ref<any>(null);

    const localPhoneNumberModel = ref(props.modelValue);
    const localIntPhoneNumberModel = ref(props.modelValue);
    const is_international = ref(false);
    const show_phone_number_error = ref(false);
    const show_int_phone_number_error = ref(false);

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === '+') {
            is_international.value = true;
            localPhoneNumberModel.value = '';
            localIntPhoneNumberModel.value = e.key;
            // Need to wait for the element to be rendered, otherwise is null
            setTimeout(() => {
                if(intPhoneNumberRef.value && intPhoneNumberRef.value.$el) {
                    intPhoneNumberRef.value.$el.focus();
                }
            }, 0);
        }
    }

    const init_event = () => {
        document.addEventListener('keydown', handleKeydown)
    }

    const stop_event = () => {
        document.removeEventListener('keydown', handleKeydown)
    }

    const emit = defineEmits(["update:modelValue"])

    const updateLocalPhoneNumberModel = (value: string) => {
        localPhoneNumberModel.value = value

        const number_area_code = localPhoneNumberModel.value.substring(1, 4)
        if(localPhoneNumberModel.value === '') {
            show_phone_number_error.value = false;
        } else if(!number_area_code.split('').includes('_')) {
            show_phone_number_error.value = !generalStore.area_codes.some((item: any) => item.area_code === number_area_code);
        }
        emit('update:modelValue', localPhoneNumberModel.value)
    }

    const updateLocalIntPhoneNumberModel = (value: string | undefined) => {
        localIntPhoneNumberModel.value = value ?? '';

        if (localIntPhoneNumberModel.value === '') {
            localPhoneNumberModel.value = '';
            is_international.value = false;
            show_int_phone_number_error.value = false;
            // Need to wait for the element to be rendered, otherwise is null
            setTimeout(() => {
                if(phoneNumberRef.value && phoneNumberRef.value.$el) {
                    phoneNumberRef.value.$el.focus();
                }
            }, 0);
        } else {
            const regex = /^\+?[0-9]*$/;
            show_int_phone_number_error.value = !regex.test(localIntPhoneNumberModel.value);
        }
        emit('update:modelValue', localIntPhoneNumberModel.value)
    }
</script>