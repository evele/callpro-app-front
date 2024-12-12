<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen">
        <Card class="w-full max-w-[850px] flex flex-col items-center justify-center font-normal gap-10">
            <!-- Bloque de logo y texto -->
            <template #header>
                <div class="mt-14 flex flex-col items-center">
                    <img alt="user header" src="@/assets/png/thecallpro.png"
                        class="w-[196px] flex-shrink-0 bg-cover bg-center" />
                    <p class="text-xl font-semibold text-[#4f378b] mt-6">Log in to your Phone Launch Account</p>
                </div>
            </template>
            <template #content>
                <!-- Formulario de Login -->
                <form @keydown.enter.prevent="next"
                    class="flex flex-col gap-10 w-full max-w-[520px] sm:w-[90vw] mx-auto">
                    <!-- Bloque de Phone Launch Account -->
                    <div class="flex flex-col items-start gap-2 w-full">
                        <label for="phonelaunch">Phone Launch Account</label>
                        <InputText id="phonelaunch" 
                            class="flex w-full py-3 border" 
                            autocomplete="off" placeholder="Enter Phone Launch Account number" />
                    </div>
                    <!-- Bloque de Pin -->
                    <div class="flex flex-col items-start gap-2 w-full">
                        <label for="pin">Pin</label>
                        <InputText id="pin" type="text" 
                            class="flex w-full py-3 border" 
                            autocomplete="off"
                            placeholder="Enter Pin number" />
                        <span id="error-message" class="text-[#b3261e] text-xs mt-3" >                                
                        </span>
                    </div>                       
                    
                </form>
            </template>

            <template #footer>
                <div class="flex flex-col gap-4 mt-10">
                    <Button type="button" 
                        class="flex justify-center items-center py-2 w-[300px] mx-auto"
                        :disabled="isPending" @click="next">
                        {{ isPending ? 'Logging in...' : 'Next' }}
                    </Button>
                    <div
                        class="flex justify-center items-start gap-1.5  w-full max-w-[600px] mx-auto text-[#4f378b] text-xs font-semibold gap-4 mt-10 mb-10">
                        <span>Do you already have an account?</span>
                        <router-link to="/login">
                            Take me to Login
                        </router-link>
                    </div>
                </div>
            </template>
        </Card>

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
const isPending = ref(false);

const authStore = useAuthStore();


function next() {
    console.log('next')
}


</script>