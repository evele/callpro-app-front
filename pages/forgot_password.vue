<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen">
        <div class="w-[850px] px-auto justify-items-center">
            <Card class="w-full flex flex-col items-center justify-center font-normal w-[786px]">
                <!-- Bloque de logo y texto -->
                <template #header>
                    <div class="mt-14 flex flex-col items-center">
                        <img alt="user header" src="@/assets/png/logo-footer 1.png"
                            class="git pull w-[196.97px] h-[58.924px] flex-shrink-0 bg-cover bg-center" />
                        <p class="text-xl text-[#4F378B] leading-7 mt-4">Enter your email to receive a password reset
                            link</p>
                    </div>
                </template>

                <template #content>
                    <form @keydown.enter.prevent="requestPasswordReset"
                        class="w-full flex flex-col items-center justify-center">
                        <!-- Bloque del mensaje de email enviado -->
                        <div v-if="showSuccessMessage" class="w-[366px] flex items-center gap-4 mb-6">
                            <div class="bg-green-500 w-10 h-10 flex items-center justify-center rounded-full">
                                <CheckSVG class="w-6 h-6 text-white" />
                            </div>
                            <div class="w-[271px] text-[#1e1e1e] text-base font-normal font-['Inter'] leading-snug">
                                An email was sent with instructions <br />to change the password
                            </div>
                        </div>
                        <!-- Primer bloque: email -->
                        <div class="w-[520px]">
                            <div class="flex item-center gap-10 w-full">
                                <div class="flex flex-col items-start gap-2 w-full">
                                    <label for="email" class="text-xl leading-7 text-left text-[#1e1e1e]">Email</label>
                                    <InputText id="email"
                                        class="flex w-full text-sm px-4 py-3 border border-[#2c2c2c] rounded-[30px] bg-white"
                                        autocomplete="off" placeholder="Enter your email" v-model="email" />
                                    <p v-if="email && !isEmailValid" class="text-red-500 text-sm">
                                        Please enter a valid email.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </template>
                <template #footer>
                    <!-- Bloque de Botones -->
                    <div class="flex justify-center w-full mx-auto mt-14 mb-14 gap-12">
                        <router-link to="/login">
                            <Button type="button"
                                class="text-current bg-white flex w-80 justify-center items-center py-2 px-4">
                                Take me to Login
                            </Button>
                        </router-link>
                        <Button type="submit" class="flex w-80  justify-center items-center py-2 px-4"
                            :disabled="!isEmailValid || isSending" @click.prevent="requestPasswordReset">
                            Send link
                        </Button>

                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores"
import CheckSVG from "~/components/svgs/CheckSVG.vue";

definePageMeta({
    layout: false,
})

const email = ref("")

const authStore = useAuthStore()
const showSuccessMessage = ref(false)
const isSending = ref(false)
const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value);
});

async function requestPasswordReset() {
    isSending.value = true
    try {
        const response = await authStore.sendRecoveryPass(email.value)
        if (response.result) {
            showSuccessMessage.value = true
            email.value = ""
            // TODO 5 segundos antes de ocultar el mensaje y resetear el campo de email
            setTimeout(() => {
                showSuccessMessage.value = false
                
            }, 5000)
        } else {
            console.log("Error:", response.errors)
        }
    } catch (error) {
        console.error("An error occurred:", error)
    }
    finally {        
        isSending.value = false
    }
}
</script>