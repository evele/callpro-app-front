<template>
    <div class="bg-card-background flex items-center justify-center min-h-screen">
        <Card class="w-full max-w-[850px] flex flex-col items-center justify-center font-normal gap-8 rounded-[30px] shadow-lg">
            <!-- Bloque de logo y texto -->
            <template #header>
                <div class="mt-14 flex flex-col items-center">
                    <img alt="user header" src="@/assets/png/thecallpro.png"
                        class="w-[196px] bg-cover bg-center" />
                    <p v-if="current_step === 1" class="text-xl font-semibold text-dark-primary-container mt-6">Log in to your Phone Launch Account</p>
                    <p v-else class="text-xl font-semibold text-dark-primary-container mt-6">Verify your phone launch account.</p>
                </div>
            </template>
            <template #content>
                <!-- First step form -->
                <form v-if="current_step === 1" @keydown.enter.prevent="next"
                    class="flex flex-col gap-8 w-full max-w-[520px] sm:w-[90vw] mx-auto">

                    <div class="flex flex-col items-start gap-2 w-full relative">
                        <label for="phonelaunch" class="text-dark-3">Phone Launch Account</label>
                        <InputNumber 
                            v-model="phone_launch_number" 
                            inputId="phonelaunch"
                            class="w-full"
                            placeholder="Enter Phone Launch Account number"
                            :useGrouping="false"
                            fluid
                            :invalid="number_error_message.length > 0"
                        />
                        <span v-show="number_error_message.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                            {{ number_error_message }}
                        </span>
                    </div>

                    <div class="flex flex-col items-start gap-2 w-full relative">
                        <label for="pin" class="text-dark-3">Pin Number</label>
                        <Password
                            id="pin" 
                            type="password"
                            class="w-full"
                            placeholder="Enter Pin number"
                            toggleMask
                            :feedback="false"
                            v-model="phone_launch_password"
                            :invalid="password_error_message.length > 0"
                        />
                        <span v-show="password_error_message.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                            {{ password_error_message }}
                        </span>             
                    </div>
                </form>

                <!-- Second step form -->
                <form v-if="current_step === 2" @keydown.enter.prevent="next">
                    <Message severity="info" class="mb-4">{{ info_message }}</Message>
                    <div class="flex flex-col items-start gap-2 w-full">
                        <InputNumber 
                            v-model="confirmation_code" 
                            inputId="confirmationCode"
                            class="w-full"
                            placeholder="Enter Confirmation Code"
                            :useGrouping="false"
                            fluid
                            :invalid="confirmation_code_error_message.length > 0"
                        />
                        <p class="text-danger text-sm">{{ confirmation_code_error_message }}</p>
                        <div class="mx-auto text-xs font-semibold flex items-center gap-2">
                            <span>Didn't recieve?</span>
                            <Button @click="handle_resend_code" class="text-dark-primary-container flex items-center gap-1 bg-transparent border-none p-0 text-xs">
                                <RenewSVG v-if="!is_sending_new_code" class="h-4 w-4" />
                                {{ is_sending_new_code ? 'Sending a new code...' : 'Resend Code'}}
                            </Button>
                        </div>
                    </div>
                </form>
            </template>

            <template #footer>
                <div class="flex flex-col gap-4 mt-14">
                    <Button type="button" 
                        class="flex justify-center items-center py-2 w-[300px] mx-auto font-bold"
                        :disabled="is_loading || is_sending_new_code" @click="next">
                        <ProgressSpinner v-if="is_loading" strokeWidth="8" fill="transparent" class="h-6 w-6 light-spinner"
                            animationDuration=".5s" aria-label="loading"                             
                        />
                        {{ is_loading ? '' : 'Next' }}
                    </Button>
                    
                    <div
                        class="flex justify-center items-start gap-1.5 w-full max-w-[600px] mx-auto text-xs font-semibold gap-4 mt-4 mb-10">
                        <span>Do you already have an account?</span>
                        <router-link to="/login" class="text-dark-primary-container">
                            Take me to Login
                        </router-link>
                    </div>
                </div>
            </template>
        </Card>
    </div>
    <Toast />
</template>

<script setup lang="ts">
    import { useAuthStore } from "@/stores"
    import RenewSVG from "~/components/svgs/RenewSVG.vue";

    definePageMeta({
        layout: false,
    })

    const authStore = useAuthStore();
    const router = useRouter()

    const phone_launch_number = ref();
    const phone_launch_password = ref('');
    const confirmation_code = ref();
    const number_error_message = ref('');
    const password_error_message = ref('');
    const confirmation_code_error_message = ref('');
    const info_message = ref('You will recive a call with a confirmation code.')

    const is_loading = ref(false)
    const is_sending_new_code = ref(false)
    const current_step = ref(1);
    const ivr_user = ref('')
    const root_id = ref('')

    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    watchEffect(() => {
        if (phone_launch_number.value) {
            number_error_message.value = ''
        }
        if (phone_launch_password.value.length) {
            password_error_message.value = ''
        }
        if (confirmation_code.value) {
            confirmation_code_error_message.value = ''
        }
    })

    const validate_first_step = () => {
        let is_valid = true
        if(phone_launch_number.value === undefined || phone_launch_number.value === null) {
            number_error_message.value = 'Phone launch account is required.'
            is_valid = false
        }
        if(phone_launch_password.value === '') {
            password_error_message.value = 'Pin number is required.'
            is_valid = false
        }
        return is_valid
    }

    const confirm_first_step = async () => {
        if(!validate_first_step()) return

        const data_to_send = {
            user: phone_launch_number.value,
            password: phone_launch_password.value
        }

        is_loading.value = true
        const response = await authStore.bindPhonelaunchAccount(data_to_send)
        is_loading.value = false

        if(response.result) {
            ivr_user.value = response.ivr_user
            root_id.value = response.root_id
            current_step.value = 2
        } else {
            if(response.validation_error) {
                if(response.validation_error.user) {
                    number_error_message.value = response.validation_error.user
                }
                if(response.validation_error.password) {
                    password_error_message.value = response.validation_error.password
                }
            }
            show_error_toast('Error', response.error || "Something went wrong, please check your credentials and try again.")
        }
    }

    const confirm_second_step = async () => {
        if(confirmation_code.value === undefined || confirmation_code.value === null) {
            confirmation_code_error_message.value = 'Confirmation code is required.'
            return
        }

        const data_to_send: validateConfirmationCode = {
            confirmation_code: confirmation_code.value,
            root_id: root_id.value
        }

        is_loading.value = true
        const response = await authStore.validateConfirmationCode(data_to_send)
        is_loading.value = false

        if(response.result) {
            router.push('/create_user')
        } else {
            if(response.error) {
                confirmation_code_error_message.value = response.error
            }
            show_error_toast('Error', "Something went wrong, please check your code and try again.")
        }
    }

    const next = () => {
        if(current_step.value === 1) {
            confirm_first_step()
        } else {
            confirm_second_step()
        }
    }

    const handle_resend_code = async () => {
        if(is_sending_new_code.value || ivr_user.value === '') return

        is_sending_new_code.value = true
        const response = await authStore.resendIVRCode({ ivr_user: ivr_user.value })
        is_sending_new_code.value = false

        if(response.result) {
            info_message.value = 'You will recive a call with a new confirmation code.'
            show_success_toast('Success', 'A new confirmation code has been sent.')
        } else {
            show_error_toast('Error', 'Something went wrong, please try again.')
        }
    }
</script>
<style scoped lang="scss">
    :deep(.p-inputnumber) {
        .p-inputtext {
            width: 100%;
            &::placeholder {
                color: #B3B3B3
            }
        }
    }
    :deep(.p-password) {
        .p-password-input {
            width: 100%;
            &::placeholder {
                color: #B3B3B3
            }
        }
        svg {
            color: #653494;
        }
    }
    :deep(.light-spinner) {
        .p-progressspinner-circle {
            stroke: white!important;
        }
    }
</style>