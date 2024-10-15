<template>
    <Dialog v-model:visible="visible" modal :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-5">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">Add new contact <ChevronDownSVG /></h2>
                <Button @click="close" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <div v-if="contact_numbers.length" class="flex flex-wrap gap-2 mt-4 mb-2">
            <div v-for="(number, i) in contact_numbers" :key="i" class="px-3 pb-1 pt-[5px] text-sm rounded-full bg-[#1D192B] w-fit text-white">
                <p><span class="rounded-full py-[2px] px-[5px] bg-white text-black text-xs mr-1">{{ i + 1 }}</span> {{ number.number }}</p>            
            </div>
        </div>

        <form @submit.prevent class="new-contact-form flex flex-col gap-5 sm:gap-6" :class="[{ 'mt-5': !contact_numbers.length}]">
            <p v-if="isSuccess" class="text-green-500">Success!</p>
            <p class="text-red-500" v-if="isError">Something went wrong.</p>

            <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                <div class="w-full">
                    <label for="contact-name" class="text-lg text-black">Name</label>
                    <InputText type="text" id="contact-name" v-model="new_contact.first_name" placeholder="Enter Name" class="w-full mt-1" :disabled="current_position > 0" />
                </div>

                <div class="w-full">
                    <label for="contact-surname" class="text-lg text-black">Surname</label>
                    <InputText type="text" id="contact-surname" v-model="new_contact.last_name" placeholder="Enter Surname" class="w-full mt-1" :disabled="current_position > 0" />
                </div>
            </div>

            <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                <div class="w-full">
                    <label for="contact-phone" class="text-lg text-black">Phone 1*</label>
                    <InputMask id="contact-phone" :invalid="number_error.length > 0" v-model="new_contact.numbers.number" mask="(999) 999-9999" placeholder="(___) ___ - ____" fluid class="w-full mt-1" />
                    <p class="text-red-500 absolute">{{ number_error }}</p>
                </div>

                <div class="w-full">
                    <label class="text-lg text-black">Type*</label>
                    <Select v-model="new_contact.numbers.type" :invalid="type_error.length > 0" :options="type_options" optionLabel="name" class="w-full mt-1" placeholder="-" :class="[{ invalid: type_error.length > 0 }]"></Select>
                    <p class="text-red-500 absolute">{{ type_error }}</p>
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
        
        
        <template #footer>
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
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query'

    const queryClient = useQueryClient()

    const visible = ref(false);
    const number_error = ref('');
    const type_error = ref('');

    // Lo dejo para testear
    const phone_number = ref('')
    const show_value = (value: string) => {
        console.log('show value', value)
    }
    // <PhoneInput :model-value="phone_number" @update:modelValue="show_value" />

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()
    const { mutate: saveContact, isPending, isError, isSuccess, reset } = useSaveContact() 

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

    const open = () => {
        visible.value = true;
    }

    const close = () => {
        visible.value = false;
        reset_contact()
        number_error.value = ''
        type_error.value = ''
        contact_numbers.value = []
        current_position.value = 0
    }

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

    defineExpose({ open });

    const validate_number_and_type = () => {
        let is_invalid = false
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/
        if(!regex.test(new_contact.numbers.number) || !new_contact.numbers.type) {
            if(!regex.test(new_contact.numbers.number)) {
                number_error.value = 'The Number field is required.'
            }
            if(!new_contact.numbers.type) {
                type_error.value = 'The Type field is required.'
            }
            is_invalid = true
        }
        return is_invalid
    }

    const add_new = () => {
        if(validate_number_and_type()) return
        
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
    }

    const go_back = () => {
        new_contact.numbers = {
            id: 'new',
            number: contact_numbers.value[current_position.value - 1].number,
            notes: contact_numbers.value[current_position.value - 1].notes,
            type: contact_numbers.value[current_position.value - 1].type,
            number_groups: contact_numbers.value[current_position.value - 1].number_groups
        }
        contact_numbers.value.pop()
        current_position.value--
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
                    queryClient.invalidateQueries({ queryKey: ['all_contacts'] })
                    setTimeout(() => {
                        reset()
                        close()
                    }, 2000);
                } else {
                    if(data.validation_error && Object.keys(data.validation_error).length > 0) {
                        const errors = Object.entries(data.validation_error)

                        errors.forEach(([key, value]) => {
                            if(key === 'contact_info[numbers][0][number]') {
                                number_error.value = value
                            }
                            if(key === 'contact_info[numbers][0][type]') {
                                type_error.value = value
                            }
                        })
                        reset()
                    }
                }
            }
        })
    }
</script>

<style scoped>
    .no-resize {
        resize: none;
    }
</style>