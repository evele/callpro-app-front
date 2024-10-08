<template>
    <Dialog v-model:visible="visible" modal :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-6">
                <h2 class="flex items-center gap-4 font-bold text-lg">Add new contact <ChevronDownSVG class="mt-1" /></h2>
                <Button @click="close" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[78px]" />
        </template>

        <form @submit.prevent class="new-contact-form flex flex-col gap-5 mt-5 sm:gap-6">
            <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                <div class="w-full">
                    <label for="name" class="text-lg text-black">Name</label>
                    <InputText type="text" id="name" v-model="new_contact.first_name" placeholder="Enter Name" class="w-full mt-1" />
                </div>

                <div class="w-full">
                    <label for="surname" class="text-lg text-black">Surname</label>
                    <InputText type="text" id="surname" v-model="new_contact.last_name" placeholder="Enter Surname" class="w-full mt-1" />
                </div>
            </div>

            <div class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-10">
                <div class="w-full">
                    <label for="phone-1" class="text-lg text-black">Phone 1*</label>
                    <InputMask id="phone-1" :invalid="number_error.length > 0" v-model="new_contact.numbers[0].number" mask="(999) 999-9999" placeholder="(___) ___ - ____" fluid class="w-full mt-1" />
                    <p class="text-red absolute">{{ number_error }}</p>
                </div>

                <div class="w-full">
                    <label cclass="text-lg text-black">Type*</label>
                    <Select v-model="new_contact.numbers[0].type" :invalid="type_error.length > 0" :options="type_options" optionLabel="name" class="w-full mt-1" placeholder="-" :class="[{ invalid: type_error.length > 0 }]"></Select>
                    <p class="text-red absolute">{{ type_error }}</p>
                </div>
            </div>

            <div class="w-full">
                <p v-if="CGIsError" class="text-red">Custom groups fetch failed D:</p>
                <div v-if="CGIsSuccess" class="w-full">
                    <label class="text-lg text-black">Groups</label>
                    <span class="text-red" v-if="!userCustomGroups?.result">Custom groups fetch failed D:</span>
                    <MultiSelect v-else v-model="new_contact.numbers[0].number_groups" :options="custom_groups_options" optionLabel="name" 
                        display="chip" class="w-full mt-1" placeholder="-" />
                </div>
            </div>

            <div class="w-full">
                <div>
                    <label for="notes-1" class="text-lg text-black">Notes</label>
                    <Textarea v-model="new_contact.numbers[0].notes" id="notes-1" cols="50" rows="5" placeholder="Enter text" class="w-full no-resize rounded-2xl mt-1" />
                    <p class="text-[#757575] text-xs mt-2">*This information is mandatory to create a new contact</p>
                    <p v-if="isSuccess" class="text-green">All good :D</p>
                    <p class="text-red" v-if="isError">Something went wrong.</p>
                </div>
            </div>
        </form>
        
        
        <template #footer>
            <footer class="flex flex-col w-full justify-center gap-4 sm:gap-6 font-bold mt-7 sm:flex-row">
                <Button @click="add_new" class="bg-[#F5F5F5] border text-black w-full max-w-[300px]">
                    Add new phone
                </Button>
                <Button @click="save_contact" :disabled="isPending" class="bg-[#653494] border-white text-white w-full max-w-[300px]">
                    {{ isPending ? 'Saving...' : 'Save' }}
                </Button>
            </footer>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const visible = ref(false);
    const number_error = ref('');
    const type_error = ref('');

    const { data: userCustomGroups, isSuccess: CGIsSuccess, isError: CGIsError } = useFetchUserCustomGrups()
    const { mutate: saveContact, isPending, isError, isSuccess, reset } = useSaveContact()

    const empty_contact: ContactToSave = {
        first_name: '',
        last_name: '',
        numbers: [{
            id: 'new',
            number: '',
            notes: '',
            type: '',
            number_groups: []
        }] 
    }
    let new_contact = reactive<ContactToSave>({...empty_contact})

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
        if (new_contact.numbers[0].type) {
            type_error.value = ''
        }
        if (new_contact.numbers[0].number) {
            number_error.value = ''
        }
    })

    const open = () => {
        visible.value = true;
        const body = document.body;
        body.style.overflow = 'hidden';
    }

    const close = () => {
        visible.value = false;
        const body = document.body;
        body.style.overflow = 'auto';
        Object.assign(new_contact, empty_contact)
        new_contact.numbers[0] = {
            id: 'new',
            number: '',
            notes: '',
            type: '',
            number_groups: []
        }
        number_error.value = ''
        type_error.value = ''
    }

    defineExpose({ open });

    const add_new = () => {
        console.log('Adding new phone...');
    }

    type number_groups_option = { code: string, name: string }

    const save_contact = () => {
        const formatted_contact: ContactToSave = {
            ...new_contact,
            numbers: new_contact.numbers.map((number: any) => {
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