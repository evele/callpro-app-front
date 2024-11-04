<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen rounded-3xl">
        <div class="w-[850px] px-auto justify-items-center">
            <Card class="w-full flex flex-col items-center justify-center font-normal">
                <!-- Bloque de logo y texto -->
                <template #header>
                    <div class="mt-14 flex flex-col items-center">
                        <img alt="user header" src="@/assets/png/thecallpro.png"
                            class="w-[196.97px] h-[58.924px] flex-shrink-0 bg-cover bg-center" />
                        <p class="text-xl text-[#4f378b]  leading-7 mt-4">Log in to your Phone Launch Account</p>
                    </div>
                </template>

                <template #content>
                    <!-- Formulario de Login -->
                    <form @keydown.enter.prevent="login" class="flex flex-col gap-9 w-[520px]">
                        <!-- Bloque de Phone Launch Account -->
                        <div class="flex flex-col items-start gap-2 w-full">
                            <label for="phonelaunch" class="text-xl leading-7 text-left text-[#1e1e1e]">Phone Launch Account</label>
                            <InputText id="phonelaunch"
                                class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                autocomplete="off" placeholder="Enter Phone Launch Account number"  />
                        </div>

                        <!-- Bloque de Pin -->
                        <div class="flex flex-col items-start gap-2 w-full">
                            <label for="pin" class="text-xl leading-7 text-left text-[#1e1e1e]">Pin</label>
                            <InputText id="pin" type="text"
                                class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                autocomplete="off" placeholder="Enter Pin number" />                            
                        </div>
                    </form>
                </template>

                <template #footer>
                    <div class="flex flex-col gap-4 mt-14">
                        <Button type="button" class="flex justify-center items-center py-2 px-4 w-[300px] mx-auto"
                            :disabled="isPending" @click.prevent="login">
                            {{ isPending ? 'Logging in...' : 'Next' }}
                        </Button>
                        <div
                            class="flex justify-between w-full max-w-[600px] mx-auto text-[#4f378b] text-xs font-['Inter'] leading-4 gap-4 mt-14 mb-14">                            
                            <span class="right-text">Do you already have an account?</span>
                            <router-link to="/login" class="text-[#4f378b] text-xs font-['Inter'] leading-4">
                                Take me to Login
                            </router-link>
                        </div>
                    </div>
                </template>
                <!-- Contenedor de los textos -->

            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores"

definePageMeta({
    layout: false,
})

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
// const rememberMe = ref(true);
const isPending = ref(false);

const authStore = useAuthStore();


function login() {
    console.log('data', email.value, password.value);
    isPending.value = true;
    authStore.login({ email: email.value, password: password.value })
        .then((response) => {
            isPending.value = false;
            if (!response.result) {
                console.log('Error en el login:', response.error);
            }
        })
        .catch(() => {
            isPending.value = false;
            console.log('Error al intentar iniciar sesión');
        });
}


</script>