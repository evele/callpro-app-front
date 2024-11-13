<template>
    <div v-if="contact_numbers.length" class="flex flex-wrap gap-2 mb-2">
        <Chip v-for="(number, i) in contact_numbers" :key="i" class="bg-[#1D192B] text-white text-sm">
            <template #default>
                <span class="rounded-full py-[2px] px-[6px] bg-white text-black text-xs mr-1">{{ i + 1 }}</span>
                {{ number.number }}
            </template>
        </Chip>
    </div>

    <form @submit.prevent class="new-contact-form flex flex-col gap-5 sm:gap-6">
        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
            <div class="w-full">
                <label for="contact-name" class="text-lg text-black">Name</label>
                <InputText type="text" id="contact-name" v-model="new_contact.first_name" placeholder="Enter Name" class="w-full mt-1" />
            </div>

            <div class="w-full">
                <label for="contact-surname" class="text-lg text-black">Surname</label>
                <InputText type="text" id="contact-surname" v-model="new_contact.last_name" placeholder="Enter Surname" class="w-full mt-1" />
            </div>
        </div>

        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
            <div class="w-full">
                <label for="contact-phone" class="text-lg text-black">Phone {{current_position + 1}}*</label>
                <PhoneInput class="mt-[2px]" :model-value="new_contact.numbers.number" @update:modelValue="(v: string) => new_contact.numbers.number = v" 
                    :number-error="number_error" :form-action="form_action" @hasError="(val: boolean) => has_phone_number_error = val" />
            </div>

            <div class="relative w-full flex">
                <div class="w-full">
                    <label class="text-lg text-black">Type*</label>
                    <Select v-model="new_contact.numbers.type" :invalid="type_error.length > 0" :options="type_options" optionLabel="name" class="w-full mt-1" placeholder="-" :class="[{ invalid: type_error.length > 0 }]"></Select>
                </div>
                <p class="text-red-500 absolute left-0 top-full">{{ type_error }}</p>
            </div>
        </div>

        <div class="w-full">
            <p v-if="CGIsError" class="text-red">Custom groups fetch failed D:</p>
            <div v-if="CGIsSuccess" class="w-full">
                <label class="text-lg text-black">Groups</label>
                <span class="text-red" v-if="!userCustomGroups?.result">Custom groups fetch failed D:</span>
                <MultiSelect v-else v-model="new_contact.numbers.number_groups" :options="custom_groups_options" optionLabel="name" 
                    display="chip" class="w-full mt-1" placeholder="-" />
            </div>
        </div>

        <div class="w-full">
            <div>
                <label for="contact-notes" class="text-lg text-black">Notes</label>
                <Textarea v-model="new_contact.numbers.notes" id="contact-notes" cols="50" rows="4" placeholder="Enter text" class="w-full no-resize rounded-2xl mt-1" />
                <p class="text-[#757575] text-xs mt-2">*This information is mandatory to create a new contact</p>
            </div>
        </div>
    </form>
    
    <footer class="flex flex-col w-full justify-center gap-4 sm:gap-6 font-bold mt-7 sm:flex-row">
        <Button v-if="contact_numbers.length" :disabled="isPending" @click="go_back" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
            Go back
        </Button>
        <Button @click="add_new" :disabled="isPending" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
            Add new phone
        </Button>
        <Button @click="save_contact" :disabled="isPending" class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E]">
            {{ isPending ? 'Saving...' : 'Save' }}
        </Button>
    </footer>
    <Toast />
</template>

<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query'

    const queryClient = useQueryClient()
    const toast = useToast()

    const number_error = ref('');
    const type_error = ref('');
    const form_action = ref('')
    const has_phone_number_error = ref(false)

    const emit = defineEmits(['success', 'error']);

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()
    const { mutate: saveContact, isPending, reset } = useSaveContact() 

    const empty_contact: ContactBeforeToSave = {
        first_name: '',
        last_name: '',
        numbers: {
            id: 'new',
            number: '',
            notes: '',
            type: '',
            number_groups: []
        }
    }
    let new_contact = reactive<ContactBeforeToSave>({...empty_contact})

    const contact_numbers = ref<ContactNumber[]>([])
    const current_position = ref(0)

    const type_options = [
        { name: 'Home', code: '4' },
        { name: 'Mobile', code: '1' },
        { name: 'Office', code: '2' },
        { name: 'Other', code: '3' }
    ]

    const custom_groups_options = computed(() => {
        if (userCustomGroups?.value?.result && userCustomGroups?.value?.custom_groups) {
            return userCustomGroups.value.custom_groups.map((group: UserCustomGroup) => {
                return {
                    name: group.group_name,
                    code: group.id
                }
            })
        }
        return []
    })

    watchEffect(() => {
        if (new_contact.numbers.type) {
            type_error.value = ''
        }
        if (new_contact.numbers.number) {
            number_error.value = ''
        }
    })

    const reset_contact = () => {
        Object.assign(new_contact, empty_contact)
        new_contact.numbers = {
            id: 'new',
            number: '',
            notes: '',
            type: '',
            number_groups: []    
        }
    }

    const validate_number_and_type = () => {
        let is_invalid = false

        if(contact_numbers.value.some((number: ContactNumber) => number.number === new_contact.numbers.number)) {
            number_error.value = 'This number is already added.'
            is_invalid = true
            return is_invalid
        }

        if(!new_contact.numbers.number || !new_contact.numbers.type || has_phone_number_error.value) {
            if(!new_contact.numbers.number) {
                number_error.value = 'The Number field is required.'
            }
            if(!new_contact.numbers.type) {
                type_error.value = 'The Type field is required.'
            }
            is_invalid = true
        }
        return is_invalid
    }

    const add_new = async () => {
        if(validate_number_and_type()) return

        form_action.value = 'clear'
        
        contact_numbers.value.push({
            id: 'new',
            number: new_contact.numbers.number,
            notes: new_contact.numbers.notes,
            type: new_contact.numbers.type,
            number_groups: new_contact.numbers.number_groups
        })
        new_contact.numbers = {
            id: 'new',
            number: '',
            notes: '',
            type: '',
            number_groups: []    
        }
        current_position.value++
        await nextTick();
        form_action.value = ''
    }

    const go_back = async () => {
        form_action.value = 'fill'
        new_contact.numbers = {
            id: 'new',
            number: contact_numbers.value[current_position.value - 1].number,
            notes: contact_numbers.value[current_position.value - 1].notes,
            type: contact_numbers.value[current_position.value - 1].type,
            number_groups: contact_numbers.value[current_position.value - 1].number_groups
        }
        contact_numbers.value.pop()
        current_position.value--
        await nextTick();
        form_action.value = ''
    }

    type number_groups_option = { code: string, name: string }

    const save_contact = () => {
        if(validate_number_and_type()) return

        const numbers_to_send = [...contact_numbers.value, new_contact.numbers]

        const formatted_contact: ContactToSave = {
            ...new_contact,
            numbers: numbers_to_send.map((number: any) => {
                return {
                    ...number,
                    number: number.number.replace(/\D/g, ''),
                    number_groups: number.number_groups.length > 0 ? number.number_groups.map((group: number_groups_option) => group.code) : null,
                    type: number.type.code
                }
            })
        }

        const data_to_send: ContactToSaveData = {
            action: 'create',
            contact_info: formatted_contact,
            save_contact: true
        }

        type res_success = {
            result: true  
        }
        
        saveContact(data_to_send, {
            onSuccess: (data: res_success | APIResponseError) => {
                if(data.result) {
                    reset_contact()
                    form_action.value = 'clear'
                    queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
                    emit('success', 'Contact saved successfully.')
                } else if(data.validation_error) {
                    emit('error', data.validation_error ?? 'Something failed, please try again.')
                } else {
                    emit('error', 'Something failed, please try again.')
                }
            },
            onError: () => emit('error', 'Something failed, please try again.')
        })
    }
</script>

<style scoped>
    .no-resize {
        resize: none;
    }
</style>