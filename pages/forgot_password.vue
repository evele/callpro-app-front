<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen">
        <Card class="max-w-[850px] w-full flex flex-col items-center justify-center font-normal gap-10 rounded-[30px] shadow-lg">
            <!-- Bloque de logo y texto -->
            <template #header>
                <div class="modal-header flex flex-col items-center mt-14">
                    <img alt="user header" src="@/assets/png/thecallpro.png" class="bg-cover bg-center" />
                    <p class="text-xl text-dark-primary-container mt-6 text-center font-medium">
                        Enter your email to receive a password reset link
                    </p>
                </div>
            </template>

            <template #content>
                <div v-if="showSuccessMessage" class="flex items-center gap-8 w-full justify-center mb-4">
                    <VerifiedSVG class="text-green-positive-secondary w-8 h-8" />
                    <p class="text-dark-3">An email was sent with instructions<br> to change the password</p>
                </div>

                <form @keydown.enter.prevent="requestPasswordReset" class="flex flex-col items-center gap-10">
                    <!-- Bloque de email -->
                    <div class="flex flex-col items-start w-full max-w-[520px] gap-2 relative">
                        <label for="email">Email</label>
                        <InputText id="email" class="w-full py-3 border h-10 placeholder-grey-7" autocomplete="off"
                            placeholder="Enter your email" v-model="email" :invalid="email_error.length > 0" />
                        <p v-if="email && !isEmailValid" class="text-danger text-sm absolute mt-1 left-0 top-full">
                            Please enter a valid email.
                        </p>
                        <span v-else-if="email_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                            {{ email_error }}
                        </span>
                    </div>

                </form>
            </template>

            <template #footer>
                <!-- Bloque de Botones -->
                <div class="flex sm:flex-row flex-col justify-center items-center gap-12 my-12 ">
                    <router-link to="/login">
                        <Button type="button"
                            class="text-dark-3 font-medium bg-white flex w-80 justify-center items-center py-2 px-4 hover:bg-gray-100">
                            Take me to Login
                        </Button>
                    </router-link>

                    <Button type="submit" class="flex w-80 justify-center items-center py-2 px-4"
                        :disabled="!isEmailValid || isSending" @click.prevent="requestPasswordReset">
                        {{ isSending ? 'Sending...' : 'Send link' }}
                    </Button>
                </div>
            </template>
        </Card>
        <Toast />
    </div>
</template>
<script setup lang="ts">

definePageMeta({
    layout: false,
})

const email = ref("")
const email_error = ref("")

const authStore = useAuthStore()
const showSuccessMessage = ref(false)
const isSending = ref(false)
const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value);
});

watch(email, () => {
    email_error.value = ""
})

const { show_success_toast, show_error_toast } = usePrimeVueToast();

async function requestPasswordReset() {
    email_error.value = ""
    isSending.value = true
    showSuccessMessage.value = false
    try {
        const response = await authStore.sendRecoveryPass(email.value)
        if ("result" in response && response.result) {
            showSuccessMessage.value = true
            email.value = ""
            show_success_toast('Success', 'An email was sent with instructions to change the password');
        } else {
            if(response.email_error) {
                email_error.value = response.email_error
            }
            show_error_toast('Error', response.error || response.email_error || 'Invalid email or something went wrong.');
        }
    } catch (error) {
        show_error_toast('Error', 'Something went wrong, please try again.');
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
</style>