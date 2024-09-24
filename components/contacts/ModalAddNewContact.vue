<template>
    <Dialog v-model:visible="visible" pt:root:class="modal">
        <template #container>
            <div class="modal-bg"></div>
            <section class="modal-container">
                <div class="modal-layout">
                    <header class="modal-header">
                        <h2 class="modal-header-title">Add new contact <ChevronDownSVG /></h2>
                        <Button class="modal-header-close" @click="close"><CloseSVG/></Button>
                    </header>

                    <form @submit.prevent class="new-contact-form flex flex-col">
                        <div class="form-block">
                            <div class="input-group">
                                <label for="name" class="block">Name</label>
                                <InputText type="text" id="name" v-model="new_contact.first_name" placeholder="Enter Name" class="custom-input" />
                            </div>

                            <div class="input-group">
                                <label for="surname" class="block">Surname</label>
                                <InputText type="text" id="surname" v-model="new_contact.last_name" placeholder="Enter Surname" class="custom-input" />
                            </div>
                        </div>

                        <div class="form-block">
                            <div class="input-group">
                                <label for="phone-1" class="block">Phone 1*</label>
                                <InputMask id="phone-1" :invalid="number_error.length > 0" v-model="new_contact.numbers[0].number" mask="(999) 999-9999" placeholder="(___) ___ - ____" fluid class="custom-input" />
                                <p class="text-red">{{ number_error }}</p>
                            </div>

                            <div class="input-group">
                                <label class="block">Type*</label>
                                <Select v-model="new_contact.numbers[0].type" :invalid="type_error.length > 0" :options="type_options" optionLabel="name" class="custom-select" placeholder="-" :class="[{ invalid: type_error.length > 0 }]"></Select>
                                <p class="text-red">{{ type_error }}</p>
                            </div>
                        </div>

                        <div class="form-block">
                            <div class="input-group">
                                <p v-if="CGIsError" class="text-red">Custom groups fetch failed D:</p>
                                <div v-if="CGIsSuccess">
                                    <label class="block">Groups</label>
                                    <span class="text-red" v-if="!userCustomGroups?.result">Custom groups fetch failed D:</span>
                                    <MultiSelect v-else v-model="new_contact.numbers[0].number_groups" :options="custom_groups_options" optionLabel="name" 
                                        display="chip" class="custom-select" placeholder="-" />
                                </div>
                            </div>
                        </div>

                        <div class="form-block">
                            <div class="input-group">
                                <label for="notes-1" class="block">Notes</label>
                                <Textarea v-model="new_contact.numbers[0].notes" id="notes-1" cols="50" rows="5" placeholder="Enter text" class="custom-textarea" />
                                <p class="text-info">*This information is mandatory to create a new contact</p>
                            </div>
                        </div>
                    </form>

                    <p v-if="isSuccess" class="text-green">All good :D</p>

                    <p class="text-red" v-if="isError">Something went wrong.</p>
                    <footer class="modal-footer">
                        <Button @click="add_new" class="modal-footer-btn btn-add-new">
                            Add new phone
                        </Button>
                        <Button @click="save_contact" :disabled="isPending" class="modal-footer-btn btn-save">
                            {{ isPending ? 'Saving...' : 'Save' }}
                        </Button>
                    </footer>
                </div>
            </section>
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
    const new_contact = reactive<ContactToSave>({...empty_contact})

    const type_options = [
        { name: 'Home', code: '4' },
        { name: 'Mobile', code: '1' },
        { name: 'Office', code: '2' },
        { name: 'Other', code: '3' }
    ]

    const custom_groups_options = computed(() => {
        if (userCustomGroups?.value?.custom_groups) {
            return userCustomGroups.value.custom_groups.map((group: UserCustomGroup) => {
                return {
                    name: group.group_name,
                    code: group.id
                }
            })
        }
        return []
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
        //TODO: RESET CONTACT OBJECT AND RESET VALIDATION
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
                    number_groups: number.number_groups.map((group: number_groups_option) => group.code),
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

<style scoped lang="scss">
    .modal-bg {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: #FFF;
        padding-bottom: 38px;
        border-radius: 30px;
        width: 100%;
    }

    .modal-layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 38px;
        width: 100%;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 90px;
        padding: 0 20px;
        border-bottom: 1px solid #CAC4D0;
        @media (min-width: 400px) {
            padding: 0 34px;
        }

        .modal-header-title {
            color: #000;
            font-size: 18px;
            font-weight: 600;
            line-height: 140%;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: auto 0;
            @media (min-width: 400px) {
                font-size: 23.8px;
            }
        }

        .modal-header-close {
            background-color: transparent;
            border: none;
            cursor: pointer;
            border-radius: 100%;
            padding: 6px;

            &:hover {
                background-color: #F5F5F5;
            }
        }
    }

    .new-contact-form {
        width: 100%;
        padding: 0 32px;
        gap: 20px;

        .form-block {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 40px;

            @media (min-width: 600px) {
                flex-direction: row;
            }

            .input-group {
                width: 100%;

                label {
                    color: #1E1E1E;
                    font-size: 19px;
                    margin-bottom: 6px;
                }

                .custom-input, .custom-select, .custom-textarea {
                    width: 100%;
                    border: 1px solid #D9D9D9;
                    padding: 8px 16px
                }

                .custom-input, .custom-select {
                    border-radius: 30px;
                }

                .custom-textarea {
                    border-radius: 10px;
                    min-height: 98px;
                }

                [aria-invalid="true"], .invalid {
                    border-color: red;
                }
            }
        }

        .text-info {
            color: #757575;
            font-size: 12px;
            margin-top: 10px;
        }
    }

    .modal-footer {
        width: 100%;
        text-align: center;
        padding: 0 26px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        @media (min-width: 370px) {
            flex-direction: row;
            gap: 20px;
        }
        @media (min-width: 500px) {
            gap: 50px;
        }

        .modal-footer-btn {
            border-radius: 30px;
            max-width: 300px;
            width: 100%;
            height: 40px;
            font-size: 16px;
            font-weight: 700;
            transition: background-color 0.3s;

            &:hover {
                cursor: pointer;
            }
        }

        .btn-add-new {
            background-color: #F5F5F5;
            color: #000;
            border: 1px solid #000;
            &:hover {
                background-color: #E5E5E5;
            }
        }

        .btn-save {
            background-color: #653494;
            color: #FFF;
            border: 1px solid #FFF;
            &:hover {
                background-color: #4A1D6E;
            }
            &:disabled {
                opacity: 0.6;
                background-color: rgba(101, 52, 148, 0.60);
                color: #B3B3B3;
                border: 1px solid #B3B3B3;
            }
        }
    }

    .text-red {
        color: red;
    }
    .text-green {
        color: green;
    }

    .errors-section {
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
    }
</style>