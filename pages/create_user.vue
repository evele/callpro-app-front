<template>
    <div class="bg-card-background flex items-center py-4 justify-center min-h-screen px-4">
        <Card class="max-w-[850px] w-full gap-7 rounded-[30px] shadow-lg">

            <template #header>
                <div class="mt-14 grid grid-cols-1 place-items-center">
                    <img alt="user header" src="@/assets/png/thecallpro.png"
                        class="w-[196] flex-shrink-0 bg-cover bg-center" />
                    <p class="text-xl text-dark-primary-container mt-4 font-medium">Create your web account</p>
                </div>
            </template>

            <template #content>
                <div v-show="success" class="flex items-center gap-6 w-full justify-center mb-4">
                    <VerifiedSVG class="text-green-positive-secondary w-8 h-8" />
                    <p class="text-dark-3">You have successfully registered!</p>
                </div>

                <form @keydown.enter.prevent="register" @submit.prevent
                    class="new-contact-form flex flex-col gap-10 md:px-6">

                    <div class="form-block">
                        <div class="flex flex-col items-start gap-2 w-full relative">
                            <label for="firstName" class="text-dark-3">First Name</label>
                            <InputText 
                                id="firstName"
                                class="w-full py-3 border h-10 placeholder-grey-7"
                                placeholder="Enter First Name" 
                                v-model="firstName"
                                :invalid="first_name_error.length > 0"
                            />
                            <span v-show="first_name_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                {{ first_name_error }}
                            </span> 
                        </div>

                        <div class="flex flex-col items-start gap-2 w-full relative">
                            <label for="lastName" class="text-dark-3">Last Name</label>
                            <InputText 
                                id="lastName"
                                class="w-full py-3 border h-10 placeholder-grey-7"
                                placeholder="Enter Last Name" 
                                v-model="lastName"
                                :invalid="last_name_error.length > 0"
                            />
                            <span v-show="last_name_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                {{ last_name_error }}
                            </span> 
                        </div>
                    </div>

                    <div class="form-block">
                        <div class="input-group">
                            <label for="phone">Phone Number</label>
                            <PhoneInput id="phone" class="mt-2 h-10" :placeholder="'Enter Phone number'" :model-value="phone" @update:modelValue="(v: string) => phone = v" 
                                :number-error="phone_error" :form-action="form_action" @hasError="(val: boolean) => has_phone_number_error = val" />
                        </div>

                        <div class="flex flex-col items-start gap-2 w-full relative">
                            <label for="email" class="text-dark-3">Email</label>
                            <InputText 
                                id="email"
                                class="w-full py-3 border h-10 placeholder-grey-7"
                                autocomplete="off" 
                                placeholder="Enter your email" 
                                v-model="email"
                                :invalid="duplicate_email || email_error.length > 0"
                            />
                            <span v-show="duplicate_email" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                There's already an account with this email. <NuxtLink class="font-bold text-primary" to="login">Sign in</NuxtLink>
                            </span>
                            <span v-show="email_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                {{ email_error }}
                            </span> 
                        </div>
                    </div>

                    <div class="form-block">
                        <div class="flex flex-col items-start gap-2 w-full relative">
                            <label for="password" class="text-dark-3">Password</label>
                            <Password  
                                id="password" 
                                type="password"
                                class="w-full"
                                placeholder="Enter your password"
                                toggleMask
                                :feedback="false"
                                v-model="password"
                                :invalid="password_error.length > 0"
                            />
                            <span v-show="password_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                {{ password_error }}
                            </span>             
                        </div>

                        <div class="flex flex-col items-start gap-2 w-full relative">
                            <label for="confirmPassword" class="text-dark-3">Confirm Password</label>
                            <Password  
                                id="confirmPassword" 
                                type="password"
                                class="w-full"
                                placeholder="Confirm your password"
                                toggleMask
                                :feedback="false"
                                v-model="confirmPassword"
                                :invalid="confirm_password_error.length > 0"
                            />
                            <span v-show="confirm_password_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                {{ confirm_password_error }}
                            </span>             
                        </div>
                    </div>

                    <div class="form-block">
                        <div class="flex flex-col items-start gap-2 w-full relative">
                            <label for="address" class="text-dark-3">Address</label>
                            <InputText 
                                id="address"
                                class="w-full py-3 border h-10 placeholder-grey-7"
                                placeholder="Enter Adress" 
                                v-model="address"
                                :invalid="address_error.length > 0"
                            />
                            <span v-show="address_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                {{ address_error }}
                            </span> 
                        </div>

                        <div class="flex flex-col items-start gap-2 w-full relative">
                            <label for="timezone" class="text-dark-3">Timezone</label>
                            <Select 
                                id="timezone" 
                                v-model="timezone" 
                                :options="timezones" 
                                optionLabel="name" 
                                optionValue="code" 
                                placeholder="Select a timezone"
                                class="w-full border border-grey-8"
                                :class="{'placeholder-color': timezone !== null}"
                                :invalid="timezone_error.length > 0"
                            ></Select>
                            <span v-show="timezone_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                                {{ timezone_error }}
                            </span> 
                        </div>
                    </div>

                    <div class="form-block mt-4 my-7">
                        <div class="flex flex-col items-start gap-8 w-full">
                            <div class="flex items-center gap-2">
                                <Checkbox inputId="agree-to-terms" v-model="agreeToTerms" :binary="true" />
                                <label for="agree-to-terms" class="text-sm text-dark-primary-container font-medium mt-[2px]">
                                    Agree to Terms of Service / Privacy Policy
                                </label>
                            </div>
                            <div class="flex items-center gap-2 bg-[#F4F0EF] rounded p-4">
                                <Transition name="fade" mode="out-in">
                                    <div v-if="!notRobot" class="w-8 h-8 flex justify-center items-center">
                                        <Checkbox inputId="not-robot" v-model="notRobot" :binary="true" />
                                    </div>
                                    <VerifiedSVG v-else class="text-green-positive-secondary w-8 h-8" />
                                </Transition>
                                <label for="not-robot" class="text-sm font-medium gap-2 mt-[2px]">No soy un robot</label>
                                <CaptchaSVG class="ml-8" />
                            </div>
                        </div>
                    </div>
                </form>
            </template>

            <template #footer>
                    <div class="new-contact-form mb-4">
                        <div class="form-block flex flex-row justify-center items-center gap-[50px]">
                            <router-link to="/login" class="w-full max-w-80">
                                <Button type="button" class="text-current bg-white w-full py-2 px-4 font-medium">
                                    Take me to Login
                                </Button>
                            </router-link>

                            <Button type="button" class="w-full max-w-80 py-2 px-4" :disabled="disabled_btn || isPending" @click.prevent="register">
                                {{ isPending ? 'Saving...' : 'Register' }}
                            </Button>
                        </div>
                    </div>                   
            </template>
        </Card>
        <Toast />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores"

const generalStore = useGeneralStore()

const { show_success_toast, show_error_toast } = usePrimeVueToast();

const timezones = computed(() => generalStore.timezones?.map((tz: Timezone) => ({ name: tz.display, code: tz.zones_id })));

definePageMeta({
    layout: false,
});

const firstName = ref('');
const lastName = ref('');
const address = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const timezone = ref<OneToNine | null>(null);
const agreeToTerms = ref(false);
const notRobot = ref(false);
const ivr_bind = ref(false)
const root_id = ref<string | null>(null)

const disabled_btn = computed(() => {
    if(agreeToTerms.value && notRobot.value && firstName.value && lastName.value && timezone.value && 
        password.value && confirmPassword.value  && !has_phone_number_error.value) {
        return false;
    }
    return true;
});

const isPending = ref(false);
const success = ref(false);

const first_name_error = ref('');
const last_name_error = ref('');
const duplicate_email = ref(false)
const email_error = ref('');
const form_action = ref<FormAction>('')
const phone_error = ref('');
const has_phone_number_error = ref(false)
const password_error = ref('');
const confirm_password_error = ref('');
const address_error = ref('');
const timezone_error = ref('');

const authStore = useAuthStore();
onMounted(() => {
    if(authStore.ivr_bind) {
        ivr_bind.value = authStore.ivr_bind
        root_id.value = authStore.root_id
    }
})

onBeforeUnmount(() => {
    authStore.ivr_bind = false
    authStore.root_id = null
})

const validate_form = () => {
    let valid = true;

    if (!firstName.value) {
        first_name_error.value = 'First name is required';
        valid = false;
    } else {
        first_name_error.value = '';
    }

    if (!lastName.value) {
        last_name_error.value = 'Last name is required';
        valid = false;
    } else {
        last_name_error.value = '';
    }

    if(has_phone_number_error.value) {
        phone_error.value = 'Phone number is required.'
        valid = false;
    } else {
        phone_error.value = ''
    }

    if (!email.value) {
        email_error.value = 'Email is required';
        valid = false;
    } else {
        email_error.value = '';
    }

    if (!password.value) {
        password_error.value = 'Password is required';
        valid = false;
    } else {
        password_error.value = '';
    }

    if(password.value.length < 8) {
        password_error.value = 'Password must be at least 8 characters long';
        valid = false;
    } else {
        password_error.value = '';
    }

    if (!confirmPassword.value) {
        confirm_password_error.value = 'Confirm password is required';
        valid = false;
    } else {
        confirm_password_error.value = '';
    }

    if (password.value !== confirmPassword.value) {
        confirm_password_error.value = 'Passwords do not match';
        valid = false;
    } else {
        confirm_password_error.value = '';
    }

    if (!address.value) {
        address_error.value = 'Address is required';
        valid = false;
    } else {
        address_error.value = '';
    }

    if (!timezone.value) {
        timezone_error.value = 'Timezone is required';
        valid = false;
    } else {
        timezone_error.value = '';
    }

    if(!agreeToTerms.value) {
        show_error_toast('Error', 'You must agree to the terms of service and privacy policy');
        valid = false;
    }

    if(!notRobot.value) {
        show_error_toast('Error', 'You must confirm you are not a robot');
        valid = false;
    }

    return valid;
}

const reset_form = () => {
    firstName.value = '';
    lastName.value = '';
    address.value = '';
    phone.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    timezone.value = null;
    agreeToTerms.value = false;
    notRobot.value = false;
    ivr_bind.value = false;
    root_id.value = null;
}

async function register() {
    duplicate_email.value = false
    success.value = false;

    if(!validate_form()) {
        show_error_toast('Error', 'You have some errors in the form');
        return;
    }

    const dataToSend: UserRegister = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        timezone: timezone.value ?? '1',
        agreeToTerms: agreeToTerms.value ? '1' : '0',
        notRobot: notRobot.value ? '1' : '0',
        ivr_bind: ivr_bind.value,
        root_id: root_id.value
    };

    try {
        isPending.value = true;
        const response: APIResponseSuccess & { message: string } | APIResponseError = await authStore.registerUser(dataToSend)

        if (response.result) {
            success.value = true;
            show_success_toast('Success', 'User registered successfully');
            form_action.value = 'clear'
            reset_form();
        } else {
            if(response.validation_error) {
                const errors = response.validation_error;
                
                if(errors.firstName) first_name_error.value = errors.firstName;
                if(errors.lastName) last_name_error.value = errors.lastName;
                if(errors.phone) phone_error.value = errors.phone;
                if(errors.email) {
                    if(errors.email === 'duplicated_email') {
                        duplicate_email.value = true
                    } else {
                        email_error.value = errors.email
                    }
                }
                if(errors.password) password_error.value = errors.password;
                if(errors.confirmPassword) confirm_password_error.value = errors.confirmPassword;
                if(errors.address) address_error.value = errors.address;
                if(errors.timezone) timezone_error.value = errors.timezone;
            }
            
            show_error_toast('Error', response.error || 'Something failed while trying to register');
        }
    } catch (error) {
        show_error_toast('Error', 'Something failed while trying to register');
    }
    isPending.value = false;
}
</script>
<style scoped lang="scss">
.new-contact-form {
    width: 100%;
    gap: 24px;

    .form-block {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 24px;

        @media (min-width: 600px) {
            flex-direction: row;
            gap: 40px;
        }

        .input-group {
            width: 100%;
        }
    }
}

:deep(.p-checkbox) {
    width: 16px;
    height: 16px;
    border: none;
    .p-checkbox-input, .p-checkbox-box {
        width: 16px;
        height: 16px;
        border: 1.8px solid #757575;
        border-radius: 4px;
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
:deep(.p-select) {
    .placeholder-color {
        color: #B3B3B3;
    }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>