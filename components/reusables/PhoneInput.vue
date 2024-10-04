<template>
    <div v-if="!is_international" class="w-full">
        <InputMask :v-model="phoneNumberModel" :invalid="phoneNumberError.length > 0" @focus="init_event" @blur="stop_event" @update:modelValue="updateValue"
        mask="(999) 999-9999" placeholder="(___) ___ - ____" fluid class="w-full py-2 px-4 border border-[#D9D9D9] rounded-[30px] transition-colors" 
        />
        <span v-if="phoneNumberError.length > 0" class="text-red-500 text-sm">{{ phoneNumberError }}</span>
    </div>
    
    <div v-else class="w-full">
        <InputText :v-model="IntPhoneNumberModel" :invalid="IntPhoneNumberError.length > 0" maxlength="20" @update:modelValue="updateValue"
            class="w-full py-2 px-4 border border-[#D9D9D9] rounded-[30px] transition-colors" />
        <span v-if="IntPhoneNumberError.length > 0" class="text-red-500 text-sm">{{ IntPhoneNumberError }}</span>
    </div>
</template>

<script setup lang="ts">
    import { useGeneralStore } from '@/stores';

    const props = defineProps({
        phoneNumberModel: { type: String, default: '' },
        phoneNumberError: { type: String, default: '' },
        IntPhoneNumberModel: { type: String, default: '' },
        IntPhoneNumberError: { type: String, default: '' },
    });

    //TODO: ver como era el tema de las props que de momento son solo readonly

    const generalStore = useGeneralStore();
    const is_international = ref(false);

    const handleKeydown = async (e: KeyboardEvent) => {
        if (e.key === '+') {
            is_international.value = true;
            props.phoneNumberModel = '';
            props.IntPhoneNumberModel = '+';
        }
    }

    const init_event = () => {
        document.addEventListener('keydown', handleKeydown)
    }

    const stop_event = () => {
        document.removeEventListener('keydown', handleKeydown)
    }

    watchEffect(() => {
        if (props.IntPhoneNumberModel === '') {
            is_international.value = false;
            props.IntPhoneNumberError = '';
        } else {
            const regex = /^\+?[0-9]*$/;
            if (!regex.test(props.IntPhoneNumberModel)) {
                props.IntPhoneNumberError = 'Invalid phone number';
            } else {
                props.IntPhoneNumberError = '';
            }
        }

        if (props.phoneNumberModel === '') {
            props.phoneNumberError = '';
        } else {
            const number_area_code = props.phoneNumberModel.substring(1, 4)
            if(!number_area_code.split('').includes('_')) {
                if (!generalStore.area_codes.some((item: any) => item.area_code === number_area_code)) {
                    props.phoneNumberError = 'Invalid area code';
                } else {
                    props.phoneNumberError = '';
                }
            };
        }
    })

    const emit = defineEmits(["update:modelValue"])
    const updateValue = (value: string) => {
        emit("update:modelValue", value)
    }
</script>