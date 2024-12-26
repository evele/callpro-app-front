<template>
    <div class="bg-[#E6E0E9] flex items-center py-4 justify-center min-h-screen px-4">
        <Card class="max-w-[850px] w-full gap-7">
            <!-- Bloque de logo y texto -->
            <template #header>
                <div class="mt-14 grid grid-cols-1 place-items-center">
                    <img alt="user header" src="@/assets/png/thecallpro.png"
                        class="w-[196] flex-shrink-0 bg-cover bg-center" />
                    <p class="text-xl text-[#4F378B]  mt-4">Create your web account</p>
                </div>
            </template>

            <template #content>
                <!-- <div class=" w-full grid sm:grid-cols-1 "> -->
                <form @keydown.enter.prevent="register" @submit.prevent
                    class="new-contact-form flex flex-col gap-10 md:px-6">
                    <!-- Primer bloque: Nombre -->
                    <div class="form-block">
                        <div class="input-group">
                            <label for="firstName">First Name</label>
                            <InputText id="firstName" class="flex w-full px-4 py-3 border mt-1"
                                autocomplete="off" placeholder="Enter name" v-model="firstName" />
                        </div>

                        <div class="input-group">
                            <label for="lastName">Last Name</label>
                            <InputText id="lastName" class="flex w-full px-4 py-3 border mt-1"
                                autocomplete="off" placeholder="Enter name" v-model="lastName" />
                        </div>
                    </div>
                    <!-- Segundo bloque: Dirección y Teléfono -->
                    <div class="form-block">
                        <div class="input-group">
                            <label for="address">Address</label>
                            <InputText id="address" class="flex w-full px-4 py-3 border mt-1" autocomplete="off"
                                placeholder="Enter address" v-model="address" />
                        </div>

                        <div class="input-group">
                            <label for="phone">Phone Number</label>
                            <InputText id="phone" class="flex w-full px-4 py-3 border mt-1" autocomplete="off"
                                placeholder="Enter phone number" v-model="phone" />
                        </div>
                    </div>
                    <!-- Tercer bloque: Email y Contraseña -->
                    <div class="form-block">
                        <div class="flex flex-col items-start gap-1 w-full">
                            <label for="email">Email</label>
                            <InputText id="email" class="flex w-full px-4 py-3 border" autocomplete="off"
                                placeholder="Enter your email" v-model="email" />
                            <span v-if="duplicate_email" class="text-red-500">There's already an account with this email. <NuxtLink class="font-bold text-primary" to="login">Sign in</NuxtLink></span>
                        </div>
                        <div class="flex flex-col items-start gap-1 w-full">
                            <label for="password">Password</label>
                            <InputText id="password" type="password" class="flex w-full px-4 py-3 border "
                                autocomplete="off" placeholder="Enter your password" v-model="password" />
                        </div>
                    </div>
                    <!-- Cuarto bloque: Confirmación de contraseña y Zona horaria -->
                    <div class="form-block">
                        <div class="flex flex-col items-start gap-1 w-full">
                            <label for="confirmPassword">Confirm
                                Password</label>
                            <InputText id="confirmPassword" type="password"
                                class="flex w-full px-4 py-3 border" autocomplete="off"
                                placeholder="Confirm your password" v-model="confirmPassword" />
                        </div>

                        <div class="flex flex-col items-start gap-1 w-full">
                            <label for="timezone">Timezone</label>
                            <Select id="timezone" v-model="timezone" :options="timezones" optionLabel="name" placeholder="Select a timezone"
                                class="w-full py-[5px] border border-[#d9d9d9]"
                            ></Select>
                        </div>
                    </div>
                    <!-- Bloque de Checkboxes -->
                    <div class="form-block mt-4 my-7">
                        <div class="flex flex-col items-start gap-8 w-full">
                            <div class="flex items-center gap-2">
                                <Checkbox inputId="agree-to-terms" v-model="agreeToTerms" :binary="true" />
                                <label for="agree-to-terms" class="text-xs text-[#4F378B]">
                                    Agree to Terms of Service / Privacy Policy
                                </label>
                            </div>
                            <div class="flex items-center gap-2">
                                <Checkbox inputId="not-robot" v-model="notRobot" :binary="true" />
                                <label for="not-robot" class="text-xs gap-2">
                                    No soy un robot
                                </label>
                            </div>
                        </div>

                    </div>
                </form>
                <!-- </div> -->
            </template>

            <template #footer>
                <!-- Bloque de Botones -->
                    <div class="new-contact-form my-4">
                        <div class="form-block flex flex-row justify-center items-center gap-[50px]">
                            <router-link to="/login" class="w-full max-w-80">
                                <Button type="button" class="text-current bg-white w-full py-2 px-4">
                                    Take me to Login
                                </Button>
                            </router-link>

                            <Button type="button" class="w-full max-w-80 py-2 px-4" :disabled="!canRegister || isPending" @click.prevent="register">
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
const format_tz = (value: OneToNine) => {
    if (!generalStore.timezones?.length) return '';
    const tz = generalStore.timezones?.find((tz: Timezone) => tz.zones_id == value)?.display;
    return tz;
}

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
const timezone = ref('');
const agreeToTerms = ref(false);
const notRobot = ref(false);
const canRegister = computed(() => {
    return agreeToTerms.value && notRobot.value && firstName.value && lastName.value && password.value && confirmPassword.value && password.value === confirmPassword.value;
});
const isPending = ref(false);
const duplicate_email = ref(false)

const authStore = useAuthStore();

async function register() {
    console.log('Registering user', { firstName, lastName, address, phone, email, password });
    duplicate_email.value = false
    isPending.value = true;
    const dataToSend = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        timezone: timezone.value,
        agreeToTerms: agreeToTerms.value,
    };
    try {
        const response: APIResponseSuccess & { message: string } | APIResponseError = await authStore.registerUser(dataToSend)

        if (response.result) {
            show_success_toast('Success', 'User registered successfully');
        } else {
            if(response.validation_error?.email) {
                duplicate_email.value = true
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


</style>