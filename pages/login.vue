<template>
    <div class="bg-[#E6E0E9] flex items-center min-h-screen justify-center py-4">
        <Card class="max-w-[850px] w-full flex flex-col items-center justify-center gap-10">
            <!-- Bloque de logo y texto -->
            <template #header>
                <div class="mt-14 flex flex-col items-center">
                    <img alt="user header" src="@/assets/png/thecallpro.png"
                        class="bg-cover bg-center" />
                    <p class="text-xl text-[#4f378b] mt-6">Log in to your dashboard</p>
                </div>
            </template>

            <template #content>
                <!-- Formulario de Login -->
                <form @keydown.enter.prevent="login" 
                class="flex flex-col gap-10 w-full max-w-[520px] sm:w-[90vw] mx-auto">
                    <!-- Bloque de Email -->
                    <div class="flex flex-col items-start gap-2 w-full">
                        <label for="email">Email</label>
                        <InputText id="email"
                            class="flex w-full py-3 border"
                            autocomplete="off" placeholder="Enter your email" v-model="email" />
                    </div>

                    <!-- Bloque de Password -->
                    <div class="flex flex-col items-start gap-2 w-full">
                        <label for="password">Password</label>
                        <InputText id="password" type="password"
                            class="flex w-full py-3 border"
                            autocomplete="off" 
                            placeholder="Enter your password" v-model="password" />                   
                    </div>
                    <!-- Bloque de "Forgot your Password" -->
                    <div class="flex justify-center text-[#4f378b] font-semibold">
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
                        class="flex justify-between w-full max-w-[600px] mx-auto text-[#4f378b] text-xs font-semibold gap-4 mt-10 mb-10">
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

const isPending = ref(false);

const authStore = useAuthStore();

function login() {
    isPending.value = true;
    authStore.login({ email: email.value, password: password.value })
        .then((response: LoginResponseSuccess | APIResponseError) => {
            isPending.value = false;
            if (!response.result) {
                if(response.validation_error) {
                    console.log('aca', response.validation_error.email);
                    show_error_toast('Error', response.validation_error.credentials_error ?? response.validation_error.email ?? response.validation_error.password ?? 'Something failed while trying to login');
                } else {
                    show_error_toast('Error', response.error || 'Something failed while trying to login');
                }
            } else {
                show_success_toast('Success', 'You have successfully logged in');
            }
        })
        .catch(() => {
            isPending.value = false;
            show_error_toast('Error', 'Something failed while trying to login');
        });
}
</script>