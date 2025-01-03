<template>
    <div v-if="contact_numbers.length" class="flex flex-wrap gap-2 mb-2">
        <Chip v-for="number in contact_numbers" :key="number.id" class="bg-[#1D192B] text-white text-sm hover:cursor-pointer" @click="navitage_to_number(number.id)">
            <template #default>
                <span class="rounded-full py-[2px] px-[6px] bg-white text-black text-xs mr-1"
                    :class="{ 'bg-emerald-300': contact.numbers.id === number.id }"
                >
                    {{ contact_numbers.findIndex((item: ContactNumber) => item.id === number.id) + 1 }}
                </span>
                <span class="leading-none">{{ format_number_to_show(number.number) }}</span>
                <Button @click="handle_remove_number(number.id)" class="rounded-full p-0 bg-[#E8DEF8] w-[14px] h-[14px] border-none shadow-md hover:bg-[#D1C6F0]">
                    <CloseSVG class="text-black w-3 h-3" />
                </Button>
            </template>
        </Chip>
    </div>

    <form @submit.prevent class="new-contact-form flex flex-col gap-5 sm:gap-6">
        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
            <div class="w-full">
                <label for="contact-name" class="text-lg text-black">Name</label>
                <InputText type="text" id="contact-name" v-model="contact.first_name" placeholder="Enter Name" class="w-full mt-1" />
            </div>

            <div class="w-full">
                <label for="contact-surname" class="text-lg text-black">Surname</label>
                <InputText type="text" id="contact-surname" v-model="contact.last_name" placeholder="Enter Surname" class="w-full mt-1" />
            </div>
        </div>

        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
            <div class="w-full">
                <label for="contact-phone" class="text-lg text-black">Phone {{current_position + 1}}*</label>
                <PhoneInput :key="contact.numbers.id" class="mt-[2px]" :model-value="contact.numbers.number" @update:modelValue="(v: string) => contact.numbers.number = v" 
                    :number-error="number_error" :form-action="form_action" @hasError="(val: boolean) => has_phone_number_error = val" />
            </div>

            <div class="relative w-full flex">
                <div class="w-full">
                    <label class="text-lg text-black">Type*</label>
                    <Select v-model="contact.numbers.type" :invalid="type_error.length > 0" :options="type_options" optionLabel="name" optionValue="code" class="w-full mt-1" placeholder="-" :class="[{ invalid: type_error.length > 0 }]"></Select>
                </div>
                <p class="text-red-500 absolute left-0 top-full">{{ type_error }}</p>
            </div>
        </div>

        <div class="w-full">
            <p v-if="CGIsError" class="text-red">Custom groups fetch failed D:</p>
            <div v-if="CGIsLoading" class="w-full">
                <label class="text-lg text-black">Groups</label>
                <Skeleton height="2rem" borderRadius="16px"></Skeleton>
            </div>
            <div v-if="CGIsSuccess" class="w-full">
                <label class="text-lg text-black">Groups</label>
                <span class="text-red" v-if="!userCustomGroups?.result">Custom groups fetch failed D:</span>
                <MultiSelect v-else v-model="contact.numbers.number_groups" :options="custom_groups_options" optionLabel="name" optionValue="code"
                    display="chip" class="w-full mt-1" placeholder="-" />
            </div>
        </div>

        <div class="w-full">
            <div>
                <label for="contact-notes" class="text-lg text-black">Notes</label>
                <Textarea v-model="contact.numbers.notes" id="contact-notes" cols="50" rows="4" placeholder="Enter text" class="w-full no-resize rounded-2xl mt-1" />
                <p class="text-[#757575] text-xs mt-2">*This information is mandatory to create a new contact</p>
            </div>
        </div>
    </form>
    
    <footer class="flex flex-col w-full justify-center gap-4 sm:gap-6 font-bold mt-7 sm:flex-row">
        <Button v-if="current_position > 0" :disabled="isPending" @click="go_previous" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
            Previous
        </Button>
        <Button v-if="show_add_new_btn" @click="add_new" :disabled="isPending" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
            Add new phone
        </Button>
        <Button v-else @click="go_next" :disabled="isPending" class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
            Next
        </Button>
        <Button @click="save_contact" :disabled="isPending" class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E]">
            {{ isPending ? 'Saving...' : 'Save' }}
        </Button>
    </footer>
    <Toast />
</template>

<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query'

    const props = defineProps({
        selectedContact: { type: Object as PropType<ContactToEdit | null>, required: false, default: null }
    })

    const queryClient = useQueryClient()

    const number_error = ref('');
    const type_error = ref('');
    const form_action = ref('')
    const has_phone_number_error = ref(false)
    const is_editing = ref(false)

    const emit = defineEmits(['close', 'success', 'error', 'update:table'])

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError, isLoading: CGIsLoading } = useFetchUserCustomGrups()
    const { mutate: saveContact, isPending, reset } = useSaveContact() 

    const temp_random_id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const is_custom_ID = (id: string) => /^\d+-[a-z0-9]{9}$/.test(id);

    const empty_contact: ContactBeforeToSave = {
        contact_id: null,
        first_name: '',
        last_name: '',
        numbers: {
            id: temp_random_id(),
            number: '',
            notes: '',
            type: '',
            number_groups: []
        }
    }
    let contact = reactive<ContactBeforeToSave>({...empty_contact})

    const contact_numbers = ref<ContactNumber[]>([])
    const numbers_to_delete = ref<ContactNumber[]>([])
    const current_position = ref(0)

    onMounted(() => {
        // if selectedContact is passed, it means we are editing a contact
        if(props.selectedContact) {
            is_editing.value = true
            const total_length = props.selectedContact?.numbers?.length ?? 0

            // if there are more than one numbers, we will show the last number in the form
            const last_number = props.selectedContact.numbers[total_length - 1]

            contact_numbers.value = props.selectedContact.numbers.map((number: ContactNumberWithReceivedGroups) => {
                return {
                    id: number.id,
                    number: number.number,
                    notes: number.notes,
                    type: number.type,
                    number_groups: convert_to_array_of_strings(number.number_groups)
                }
            })
            current_position.value = total_length - 1

            contact.contact_id = props.selectedContact.id
            contact.first_name = props.selectedContact.first_name
            contact.last_name = props.selectedContact.last_name
            Object.assign(contact.numbers, {
                id: last_number.id,
                number: last_number.number,
                notes: last_number.notes,
                type: last_number.type,
                number_groups: convert_to_array_of_strings(last_number.number_groups)
            })
        } else {
            is_editing.value = false
        }
    })

    const convert_to_array_of_strings = (groups: StringOrNull) => {
        if(!groups) return []
        return groups.split(',').filter((item: string) => item != '0').map((item: string) => item.trim())
    }

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
        if (contact.numbers.type) {
            type_error.value = ''
        }
        if (contact.numbers.number) {
            number_error.value = ''
        }
    })

    const reset_contact = () => {
        Object.assign(contact, empty_contact)
        contact.numbers = {
            id: temp_random_id(),
            number: '',
            notes: '',
            type: '',
            number_groups: []    
        }
    }

    const validate_number_and_type = () => {
        let is_invalid = false

        if(contact_numbers.value.some((number: ContactNumber ) => number.number === format_number_to_send(contact.numbers.number) && number.id !== contact.numbers.id)) {
            number_error.value = 'This number is already added.'
            is_invalid = true
            return is_invalid
        }

        if(!contact.numbers.number || !contact.numbers.type || has_phone_number_error.value) {
            if(!contact.numbers.number) {
                number_error.value = 'The Number field is required.'
            }
            if(!contact.numbers.type) {
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
            id: contact.numbers.id,
            number: format_number_to_send(contact.numbers.number),
            notes: contact.numbers.notes,
            type: contact.numbers.type,
            number_groups: contact.numbers.number_groups
        })
        
        contact.numbers = {
            id: temp_random_id(),
            number: '',
            notes: '',
            type: '',
            number_groups: []    
        }
        current_position.value++
        await nextTick();
        form_action.value = ''
    }

    const go_next = async () => {
        if(validate_number_and_type()) return
        form_action.value = 'clear'

        contact_numbers.value[current_position.value] = {
            id: contact.numbers.id,
            number: format_number_to_send(contact.numbers.number),
            notes: contact.numbers.notes,
            type: contact.numbers.type,
            number_groups: contact.numbers.number_groups
        }

        const next_number = contact_numbers.value[current_position.value + 1]
        if(next_number) {
            contact.numbers = {
                id: next_number.id,
                number: next_number.number,
                notes: next_number.notes,
                type: next_number.type,
                number_groups: next_number.number_groups
            }
        } else {
            contact.numbers = {
                id: temp_random_id(),
                number: '',
                notes: '',
                type: '',
                number_groups: []
            }
        }
 
        current_position.value++
        await nextTick();
        form_action.value = ''
    }

    const go_previous = async () => {
        form_action.value = 'fill'
        const prev_number = contact_numbers.value[current_position.value - 1]
        contact.numbers = {
            id: prev_number.id,
            number: prev_number.number,
            notes: prev_number.notes,
            type: prev_number.type,
            number_groups: prev_number.number_groups
        }

        current_position.value--
        await nextTick();
        form_action.value = ''
    }

    const handle_remove_number = (id: string) => {
        const is_current_number = contact.numbers.id === id
        
        const next_number = contact_numbers.value[current_position.value + 1]
        const prev_number = contact_numbers.value[current_position.value - 1]

        const selected_number = contact_numbers.value.find((item: ContactNumber) => item.id === id)!
        selected_number.number = 'deleted'

        numbers_to_delete.value.push(selected_number)
        contact_numbers.value = contact_numbers.value.filter((item: ContactNumber) => item.id !== id)

        if(is_current_number) {
            contact.numbers = {
                id: next_number?.id ?? prev_number?.id ?? temp_random_id(),
                number: next_number?.number ?? prev_number?.number ?? '',
                notes: next_number?.notes ?? prev_number?.notes ?? '',
                type: next_number?.type ?? prev_number?.type ?? '',
                number_groups: next_number?.number_groups ?? prev_number?.number_groups ?? []
            }

            if(next_number) {
                current_position.value = contact_numbers.value.findIndex((item: ContactNumber) => item.id === next_number.id)
            } else if(prev_number) {
                current_position.value = contact_numbers.value.findIndex((item: ContactNumber) => item.id === prev_number.id)
            } else {
                current_position.value = contact_numbers.value.length
            }

        } else {
            const to_assign = contact_numbers.value.findIndex((item: ContactNumber) => item.id === contact.numbers.id)
            current_position.value = to_assign !== -1 ? to_assign : contact_numbers.value.length
        }
        
    }

    const navitage_to_number = (id: string) => {
        const number = contact_numbers.value.find((item: ContactNumber) => item.id === id)
        if(number) {
            contact.numbers = {
                id: number.id,
                number: number.number,
                notes: number.notes,
                type: number.type,
                number_groups: number.number_groups
            }
            current_position.value = contact_numbers.value.findIndex((item: ContactNumber) => item.id === id)
        }
    }

    const is_in_previous_position = computed(() => current_position.value !== contact_numbers.value.length)
    const show_add_new_btn = computed(() => !contact_numbers.value.length || !is_in_previous_position.value)

    const save_contact = () => {
        if(validate_number_and_type()) return

        let numbers_to_send = []
        if(is_in_previous_position.value) {
            contact_numbers.value[current_position.value] = {
                id: contact.numbers.id,
                number: format_number_to_send(contact.numbers.number),
                notes: contact.numbers.notes,
                type: contact.numbers.type,
                number_groups: contact.numbers.number_groups
            }
            numbers_to_send = [...contact_numbers.value]
        } else {
            numbers_to_send = [...contact_numbers.value, contact.numbers]
        }

        if(numbers_to_delete.value.length > 0) {
            numbers_to_send = [...numbers_to_send, ...numbers_to_delete.value]
        }

        const formatted_contact: ContactToSave = {
            ...contact,
            numbers: numbers_to_send.map((number: ContactNumber) => {
                return {
                    ...number,
                    id: is_custom_ID(number.id) ? 'new' : number.id,
                    number: number.number === 'deleted' ? 'deleted' : format_number_to_send(number.number),
                    number_groups: number.number_groups.length > 0 ? number.number_groups.map((group) => group) : [],
                    type: number.type
                }
            })
        }

        const data_to_send: ContactToSaveData = {
            action: is_editing.value ? 'update' : 'create',
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
                    emit('update:table')
                    emit('close')
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