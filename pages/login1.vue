<template>
    <Card class="w-full max-w-[850px] flex flex-col items-center justify-center">
        <!-- Bloque de logo y texto -->
        <template #header>
            <div class="mt-14 flex flex-col items-center">
                <img alt="user header" :src="'/assets/png/logo-footer 1.png'"
                    class="w-[196.97px] h-[58.924px] flex-shrink-0 bg-cover bg-center" />
                <p class="text-xl text-[#4f378b] font-semibold leading-7 mt-4">Log in to your dashboard</p>
            </div>
        </template>

        <template #content>
            <!-- Formulario de Login -->
            <form @keydown.enter.prevent="login" class="flex flex-col gap-9 w-full my-14 w-[520px]">
                <!-- Bloque de Email -->
                <div class="flex flex-col items-start gap-2 w-full">
                    <label for="email" class="text-xl leading-6 text-left text-[#1e1e1e]">Email*</label>
                    <InputText id="email"
                        class="flex w-full text-[19.55px] px-3 py-4 border border-[#2c2c2c] rounded-[30px] bg-white"
                        autocomplete="off" placeholder="Enter your email" v-model="email" />
                </div>

                <!-- Bloque de Password -->
                <div class="flex flex-col items-start gap-2 w-full">
                    <label for="password" class="text-xl leading-6 text-left text-[#1e1e1e]">Password*</label>
                    <InputText id="password" type="password"
                        class="flex w-full text-[19.55px] px-3 py-4 border border-[#2c2c2c] rounded-[30px] bg-white"
                        autocomplete="off" placeholder="Enter your password" v-model="password" />
                    <div
                        class="h-[38px] px-4 py-3 bg-white rounded-[30px] border border-[#d9d9d9] justify-start items-center inline-flex">
                        <div
                            class="grow shrink basis-0 text-[#b3b3b3] text-sm font-normal font-['Inter'] leading-[14px]">
                            Enter Password</div>
                        <div class="w-3.5 h-3.5 relative"></div>
                    </div>
                    <div class="text-[#4f378b] text-xs font-semibold font-['Inter'] leading-none">
                        Forgot your Password
                    </div>
                </div>

                <!-- Bloque de "Remember me" -->
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="rememberMe" v-model="rememberMe"
                        class="w-4 h-4 border border-[#2c2c2c] rounded-full" />
                    <label for="rememberMe" class="text-base text-[#1e1e1e]">Remember me</label>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex flex-col gap-4 mt-14 mb-14">
                <Button type="button" class="flex justify-center items-center py-2 px-4 w-[300px] mx-auto"
                    :disabled="isPending" @click.prevent="login">
                    {{ isPending ? 'Logging in...' : 'Login' }}
                </Button>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
// import logoFooter from '../assets/png/logo-footer 1.png'

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isPending = ref(false);

const authStore = useAuthStore();

function login() {
    console.log('data', email.value, password.value);
    isPending.value = true;
    authStore.login({ email: email.value, password: password.value, rememberMe: rememberMe.value })
        .then((response) => {
            isPending.value = false;
            if (!response.result) {
                console.log('Error en el login:', response.errors);
            }
        })
        .catch(() => {
            isPending.value = false;
            console.log('Error al intentar iniciar sesión');
        });
}


</script>