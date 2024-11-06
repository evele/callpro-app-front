<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen rounded-3xl">
        <div class="max-w-[850px] w-[90vw] px-auto justify-items-center">
            <Card class="w-full flex flex-col items-center justify-center font-normal gap-10">
                <!-- Bloque de logo y texto -->
                <template #header>
                    <div class="modal-header flex flex-col items-center mt-14">
                        <img alt="user header" src="@/assets/png/thecallpro.png" class="bg-cover bg-center" />
                        <p class="text-xl text-[#4f378b] mt-6 text-center">
                            Enter your email to receive a password reset link
                        </p>
                    </div>
                </template>

                <template #content>
                    <form @keydown.enter.prevent="requestPasswordReset" class="flex flex-col items-center gap-10">

                        <!-- Bloque del mensaje de email enviado -->
                        <div v-if="showSuccessMessage"
                            class="flex items-center gap-4 bg-green-500 text-white px-4 py-2 rounded-lg">
                            <CheckSVG class="w-6 h-6" />
                            <span>An email was sent with instructions<br />to change the password</span>
                        </div>
                        <!-- Primer bloque: email -->


                        <!-- Bloque de email -->
                        <div class="flex flex-col items-start w-full max-w-[520px] gap-2">
                            <label for="email">Email</label>
                            <InputText id="email" class="w-full py-3 border" autocomplete="off"
                                placeholder="Enter your email" v-model="email" />
                            <p v-if="email && !isEmailValid" class="text-red-500 text-sm">
                                Please enter a valid email.
                            </p>
                        </div>

                    </form>
                </template>

                <template #footer>
                    <!-- Bloque de Botones -->
                    <div class="flex sm:flex-row flex-col justify-center items-center gap-12 my-12 ">
                        <router-link to="/login">
                            <Button type="button"
                                class="text-current bg-white flex w-80 justify-center items-center py-2 px-4">
                                Take me to Login
                            </Button>
                        </router-link>

                        <Button type="submit" class="flex w-80 justify-center items-center py-2 px-4"
                            :disabled="!isEmailValid || isSending" @click.prevent="requestPasswordReset">
                            Send link
                        </Button>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
<script setup lang="ts">
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
        if ("result" in response && response.result) {
            showSuccessMessage.value = true
            email.value = ""
            // TODO 5 segundos antes de ocultar el mensaje y resetear el campo de email
            setTimeout(() => {
                showSuccessMessage.value = false

            }, 5000)
        } else {
            console.log("Error:", response.error)
        }
    } catch (error) {
        console.error("An error occurred:", error)
    }
    finally {
        isSending.value = false
    }
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
    margin-top: 50px;


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
</style>