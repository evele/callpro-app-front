<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen rounded-3xl">
        <div class="max-w-[850px] w-[90vw] px-auto justify-items-center">
            <Card class="gap-7">
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
                        class="new-contact-form flex flex-col gap-10">
                        <!-- Primer bloque: Nombre -->
                        <div class="form-block">
                            <div class="input-group">
                                <label for="firstName">First
                                    Name</label>
                                <InputText id="firstName" class="flex w-full text-sm px-4 py-3 border "
                                    autocomplete="off" placeholder="Enter name" v-model="firstName" />
                            </div>

                            <div class="input-group">
                                <label for="lastName">Last
                                    Name</label>
                                <InputText id="lastName" class="flex w-full text-sm px-4 py-3 border "
                                    autocomplete="off" placeholder="Enter name" v-model="lastName" />
                            </div>
                        </div>
                        <!-- Segundo bloque: Dirección y Teléfono -->
                        <div class="form-block">
                            <div class="input-group">
                                <label for="address">Address</label>
                                <InputText id="address" class="flex w-full text-sm px-4 py-3 border " autocomplete="off"
                                    placeholder="Enter address" v-model="address" />
                            </div>

                            <div class="input-group">
                                <label for="phone">Phone
                                    Number</label>
                                <InputText id="phone" class="flex w-full text-sm px-4 py-3 border " autocomplete="off"
                                    placeholder="Enter phone number" v-model="phone" />
                            </div>
                        </div>
                        <!-- Tercer bloque: Email y Contraseña -->
                        <div class="form-block">
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="email">Email</label>
                                <InputText id="email" class="flex w-full text-sm px-4 py-3 border " autocomplete="off"
                                    placeholder="Enter your email" v-model="email" />
                            </div>
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="password">Password</label>
                                <InputText id="password" type="password" class="flex w-full text-sm px-4 py-3 border "
                                    autocomplete="off" placeholder="Enter your password" v-model="password" />
                            </div>
                        </div>
                        <!-- Cuarto bloque: Confirmación de contraseña y Zona horaria -->
                        <div class="form-block">
                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="confirmPassword">Confirm
                                    Password</label>
                                <InputText id="confirmPassword" type="password"
                                    class="flex w-full text-sm px-4 py-3 border " autocomplete="off"
                                    placeholder="Confirm your password" v-model="confirmPassword" />
                            </div>

                            <div class="flex flex-col items-start gap-2 w-full">
                                <label for="timezone">Timezone</label>
                                <select id="timezone"
                                    class="flex w-full px-4 py-3 text-[#b3b3b3] border border-[#d9d9d9] rounded-[30px] bg-white"
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
                        <div class="form-block mt-8 my-7">
                            <div class="flex flex-col items-start gap-8 w-full">
                                <div class="flex items-center gap-2">
                                    <Checkbox v-model="agreeToTerms" :binary="true" />
                                    <label for="agreeToTerms" class="text-xs text-[#4F378B]">
                                        Agree to Terms of Service / Privacy Policy
                                    </label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Checkbox v-model="notRobot" :binary="true" />
                                    <label for="notRobot" class="text-xs gap-2">
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
                     </div>                   
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from "@/stores"


const generalStore = useGeneralStore()
const format_tz = (value: OneToNine) => {
    if (!generalStore.timezones?.length) return '';
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
function showError(message: string) {
    // Puedes usar un sistema de notificaciones, un modal o una alerta simple
    alert(message); // Simplemente muestra una alerta
    // Si estás utilizando un componente de notificación o un modal, puedes integrarlo aquí.
}
</script>
<style scoped lang="scss">
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
}

.new-contact-form {
    width: 100%;
    padding: 0 32px;
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
</style>