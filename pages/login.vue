<template>
    <div class="bg-card-background flex items-center min-h-screen justify-center py-4">
        <Card class="max-w-[850px] w-full flex flex-col items-center justify-center gap-10 rounded-[30px] shadow-lg">
            <!-- Bloque de logo y texto -->
            <template #header>
                <div class="mt-14 flex flex-col items-center">
                    <img alt="user header" src="@/assets/png/thecallpro.png" class="bg-cover bg-center" />
                    <p class="text-xl text-dark-primary-container mt-6 font-medium">Log in to your dashboard</p>
                </div>
            </template>

            <template #content>
                <!-- Formulario de Login -->
                <div v-show="success" class="flex items-center gap-6 w-full justify-center mb-2">
                    <VerifiedSVG class="text-green-positive-secondary w-8 h-8" />
                    <p class="text-dark-3">You have successfully logged in!</p>
                </div>

                <form @keydown.enter.prevent="login" 
                class="flex flex-col gap-10 w-full max-w-[520px] sm:w-[90vw] mx-auto">
                    <!-- Bloque de Email -->
                    <div class="flex flex-col items-start gap-2 w-full relative">
                        <label for="email" class="text-dark-3">Email</label>
                        <InputText 
                            id="email"
                            class="w-full py-3 border h-10 placeholder-grey-7"
                            autocomplete="off" 
                            placeholder="Enter your email" 
                            v-model="email"
                            :invalid="credentials_error.length > 0 || email_error.length > 0"
                        />
                        <span 
                            v-show="credentials_error.length || email_error.length" 
                            class="text-danger text-sm absolute mt-1 left-0 top-full"
                        >
                            {{ credentials_error || email_error }}
                        </span>
                    </div>

                    <!-- Bloque de Password -->
                    <div class="flex flex-col items-start gap-2 w-full relative">
                        <label for="password" class="text-dark-3">Password</label>
                        <Password  
                            id="password" 
                            type="password"
                            class="w-full"
                            autocomplete="off" 
                            placeholder="Enter your password"
                            toggleMask
                            :feedback="false"
                            v-model="password"
                            :invalid="credentials_error.length > 0 || password_error.length > 0"
                        />
                        <span 
                            v-show="credentials_error.length || password_error.length" 
                            class="text-danger text-sm absolute mt-1 left-0 top-full"
                        >
                            {{ credentials_error || password_error }}
                        </span>             
                    </div>
                    <!-- Bloque de "Forgot your Password" -->
                    <div class="flex justify-center text-dark-primary-container font-semibold">
                        <router-link to="/forgot_password" >Forgot your Password?</router-link>
                         
                    </div>
                </form>
            </template>

            <template #footer>
                <div class="flex flex-col gap-4 mt-10">
                    <Button type="button" 
                        class="flex justify-center items-center py-2 w-[300px] mx-auto"
                        :disabled="isPending" @click.prevent="login">
                        {{ isPending ? 'Logging in...' : 'Login' }}
                    </Button>
                    <div
                        class="flex justify-between w-full max-w-[600px] mx-auto text-dark-primary-container text-xs font-semibold gap-4 mt-10 mb-10">
                        <!-- <span class="left-text">Sign up today</span> -->
                        <router-link to="/create_user">
                            Sign up today
                        </router-link>
                        <!-- <span class="right-text">Bind your Phone Launch Account</span> -->
                        <router-link to="/bind_phone_launch_account">
                            Bind your Phone Launch Account
                        </router-link>
                    </div>
                </div>
            </template>
        </Card>
        <Toast />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores"

definePageMeta({
  layout: false,
})

const { show_success_toast, show_error_toast } = usePrimeVueToast();

const email = ref('');
const password = ref('');
const email_error = ref('');
const password_error = ref('');
const credentials_error = ref('');

const isPending = ref(false);
const success = ref(false);

const authStore = useAuthStore();

function login() {
    email_error.value = '';
    password_error.value = '';
    credentials_error.value = '';

    isPending.value = true;
    authStore.login({ email: email.value, password: password.value })
        .then((response: LoginResponseSuccess | APIResponseError) => {
            isPending.value = false;
            if (!response.result) {
                if(response.validation_error) {
                    const errors = response.validation_error;
                    
                    if(errors.email) email_error.value = response.validation_error.email;
                    if(errors.password) password_error.value = response.validation_error.password;
                    if(errors.credentials_error) credentials_error.value = response.validation_error.credentials_error;

                    show_error_toast('Error', response.validation_error.credentials_error ?? response.validation_error.email ?? response.validation_error.password ?? 'Something failed while trying to login');
                } else {
                    show_error_toast('Error', response.error || 'Something failed while trying to login');
                }
            } else {
                success.value = true;
                show_success_toast('Success', 'You have successfully logged in');
            }
        })
        .catch(() => {
            isPending.value = false;
            show_error_toast('Error', 'Something failed while trying to login');
        });
}
</script>
<style scoped lang="scss">
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
</style>