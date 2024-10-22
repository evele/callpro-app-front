<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen rounded-3xl">
        <div class="w-[850px] px-auto justify-items-center">
            <Card class="w-full flex flex-col items-center justify-center font-normal">
                <!-- Bloque de logo y texto -->
                <template #header>
                    <div class="mt-14 flex flex-col items-center">
                        <img alt="user header" src="@/assets/png/logo-footer 1.png"
                            class="w-[196.97px] h-[58.924px] flex-shrink-0 bg-cover bg-center" />
                        <p class="text-xl text-[#4F378B] leading-7 mt-4">Create your web account</p>
                    </div>
                </template>

                <template #content>
                    <form @keydown.enter.prevent="register" class="flex flex-col gap-5 w-[786px]">
                        <!-- Primer bloque: Nombre -->
                        <div class="flex items-start gap-10 w-full">
                            <div class="flex flex-col gap-2 w-full">
                                <label for="firstName" class="text-xl leading-7 text-left text-[#1e1e1e]">First
                                    Name</label>
                                <InputText id="firstName"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Enter name" v-model="firstName" />
                            </div>
                            <div class="flex flex-col gap-2 w-full">
                                <label for="lastName" class="text-xl leading-7 text-left text-[#1e1e1e]">Last
                                    Name</label>
                                <InputText id="lastName"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Enter name" v-model="lastName" />
                            </div>
                        </div>


                        <!-- Segundo bloque: Dirección y Teléfono -->
                        <div class="flex items-start gap-5 w-full">
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="address" class="text-xl leading-7 text-left text-[#1e1e1e]">Address</label>
                                <InputText id="address"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Enter address" v-model="address" />
                            </div>
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="phone" class="text-xl leading-7 text-left text-[#1e1e1e]">Phone
                                    Number</label>
                                <InputText id="phone"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Enter phone number" v-model="phone" />
                            </div>
                        </div>


                        <!-- Tercer bloque: Email y Contraseña -->
                        <div class="flex items-start gap-5 w-full">
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="email" class="text-xl leading-7 text-left text-[#1e1e1e]">Email</label>
                                <InputText id="email"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Enter your email" v-model="email" />
                            </div>
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="password"
                                    class="text-xl leading-7 text-left text-[#1e1e1e]">Password</label>
                                <InputText id="password" type="password"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Enter your password" v-model="password" />
                            </div>
                        </div>


                        <!-- Cuarto bloque: Confirmación de contraseña y Zona horaria -->
                        <div class="flex items-start gap-5 w-full">
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="confirmPassword" class="text-xl leading-7 text-left text-[#1e1e1e]">Confirm
                                    Password</label>
                                <InputText id="confirmPassword" type="password"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Confirm your password" v-model="confirmPassword" />
                            </div>
                            <!-- <div class="flex flex-col items-start gap-2 w-full">
                                <label for="timezone"
                                    class="text-xl leading-7 text-left text-[#1e1e1e]">Timezone</label>
                                <InputText id="timezone"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    autocomplete="off" placeholder="Enter timezone" v-model="timezone" />
                            </div> -->
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="timezone"
                                    class="text-xl leading-7 text-left text-[#1e1e1e]">Timezone</label>
                                <select id="timezone"
                                    class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                    v-model="timezone">
                                    <option value="" disabled>Select a timezone</option>
                                    <option v-for="tz in generalStore.timezones" :key="tz.zones_id"
                                        :value="tz.zones_id">
                                        {{ tz.display }}
                                    </option>
                                </select>
                            </div>
                        </div>


                        <!-- Bloque de Checkboxes -->
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="agreeToTerms" :binary="true" />
                            <label for="agreeToTerms" class="text-xs text-[#4F378B]">
                                Agree to Terms of Service / Privacy Policy
                            </label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="notRobot" :binary="true" />
                            <label for="notRobot" class="text-xs gap-2 font-['Inter'] leading-4">
                                No soy un robot
                            </label>
                        </div>
                    </form>
                </template>

                <template #footer>
                    <!-- Bloque de Botones -->
                    <div class="flex justify-center gap-14 w-full max-w-[786px] mx-auto gap-4 mt-14">
                        <router-link to="/login">
                            <Button type="button"
                                class="text-current bg-white flex w-80 justify-center items-center py-2 px-4">
                                Take me to Login
                            </Button>
                        </router-link>                       
                        <Button type="button" class="flex w-80  justify-center items-center py-2 px-4"
                            :disabled="!canRegister" @click.prevent="register">
                            Register
                        </Button>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from "@/stores"
import SwitchSVG from '@/components/svgs/SwitchSVG.vue';

const generalStore = useGeneralStore()
const format_tz = (value: OneToNine) => {
        if(!generalStore.timezones?.length) return '';
        const tz = generalStore.timezones?.find((tz: Timezone) => tz.zones_id == value)?.display;
        return tz;
    }

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

const authStore = useAuthStore();

async function register() {
    console.log('Registering user', { firstName, lastName, address, phone, email, password });
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
        agreeToTerms: agreeToTerms.value, // Asegúrate de que agreeToTerms sea un Ref
    };
    try {
        const response = await authStore.registerUser(dataToSend)

        if ('result' in response && response.result) {
        // Mostrar un mensaje de éxito o redirigir
        console.log('User registered successfully');
        } else {
        // Mostrar un mensaje de error
        if (response.error) {
        showError(response.error); // Solo llamar si error está definido
        } else {
        console.error('Error during registration, but no message was provided.');
        }
        }
    } catch (error) {
        console.error('An error occurred during registration:', error);
        showError('An unexpected error occurred.');
    }

}
function showError(message:string) {
    // Puedes usar un sistema de notificaciones, un modal o una alerta simple
    alert(message); // Simplemente muestra una alerta
    // Si estás utilizando un componente de notificación o un modal, puedes integrarlo aquí.
}
</script>
