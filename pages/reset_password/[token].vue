<template>
    <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen">
        <Card class="max-w-[850px] w-full flex flex-col items-center justify-center font-normal gap-10 rounded-[30px] shadow-lg">
            <template #header>
                <div class="modal-header flex flex-col items-center mt-14">
                    <img alt="user header" src="@/assets/png/thecallpro.png" class="bg-cover bg-center" />
                    <h2 class="text-xl text-dark-primary-container mt-6 text-center font-medium">
                        Reset Your Password
                    </h2>
                </div>
            </template>

            <template #content>
                <div v-if="showSuccessMessage" class="flex items-center gap-6 w-full justify-center mb-6">
                    <VerifiedSVG class="text-green-positive-secondary w-8 h-8" />
                    <p class="text-dark-3">Password changed successfully!</p>
                </div>

                <form @keydown.enter.prevent="resetPassword" class="flex flex-col gap-10 w-full max-w-[520px] sm:w-[90vw] mx-auto">
                    <div class="flex flex-col items-start gap-2 w-full relative">
                        <label for="new-password" class="text-dark-3">New Password</label>
                        <Password  
                            id="new-password" 
                            type="password"
                            class="w-full"
                            placeholder="Enter new password"
                            toggleMask
                            tabindex="1"
                            :feedback="false"
                            v-model="newPassword"
                            :invalid="new_password_error.length > 0"
                        />
                        <span v-show="new_password_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                            {{ new_password_error }}
                        </span>
                    </div>

                    <div class="flex flex-col items-start gap-2 w-full relative">
                        <label for="confirm-password" class="text-dark-3">Confirm Password</label>
                        <Password  
                            id="confirm-password" 
                            type="password"
                            class="w-full"
                            placeholder="Confirm your password"
                            toggleMask
                            tabindex="2"
                            :feedback="false"
                            v-model="confirmPassword"
                            :invalid="confirm_password_error.length > 0"
                        />
                        <span v-show="confirm_password_error.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                            {{ confirm_password_error }}
                        </span>             
                    </div>
                </form>
            </template>

            <template #footer>
                <!-- Bloque de Botones -->
                <div class="flex sm:flex-row flex-col justify-center items-center gap-12 my-12 ">
                    <Button type="submit" class="flex w-80 justify-center items-center py-2 px-4"
                        :disabled="disable_btn" @click.prevent="resetPassword">
                        {{ isSending ? 'Sending...' : 'Confirm' }}
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

const { show_success_toast, show_error_toast } = usePrimeVueToast();

const newPassword = ref("")
const confirmPassword = ref("")

const isSending = ref(false)
const showSuccessMessage = ref(false)
const new_password_error = ref("")
const confirm_password_error = ref("")

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const disable_btn = computed(() => {
    return isSending.value || !newPassword.value || !confirmPassword.value || new_password_error.value.length > 0 || confirm_password_error.value.length > 0 
})
const token = computed(() => Array.isArray(route.params.token) ? route.params.token[0] : route.params.token);

const validateToken = () => {
  const tokenRegex = /^[a-zA-Z0-9\-\._\$]{20,}$/;
  return token.value && tokenRegex.test(token.value);
};

onMounted(() => {
    if (!validateToken()) {
        show_error_toast('Error', 'Invalid token');
        router.push("/login")
    }
})

const validate_form = () => {
    if (!newPassword.value) {
        new_password_error.value = "New password is required"
        return false
    }
    if(newPassword.value.length < 8) {
        new_password_error.value = "Password must be at least 8 characters long"
        return false
    }
    if (!confirmPassword.value) {
        confirm_password_error.value = "Confirm password is required"
        return false
    }
    if (newPassword.value !== confirmPassword.value) {
        new_password_error.value = "Passwords do not match"
        confirm_password_error.value = "Passwords do not match"
        return false
    }
    return true
}

watch( () => ({ newPassword: newPassword.value, confirmPassword: confirmPassword.value }), 
        ({ newPassword, confirmPassword }: { newPassword: string, confirmPassword: string }) => { 
        if (newPassword) {
            new_password_error.value = ""
        }
        if(confirmPassword) {
            confirm_password_error.value = ""
        }
    },
    { immediate: true }
);

async function resetPassword() {
    if (!validate_form()) return

    try {
        isSending.value = true
        const data_to_send = {
            new_password: newPassword.value,
            new_password_confirm: confirmPassword.value,
            token: token.value
        }
        const response = await authStore.resetPassword(data_to_send)

        if (response.result) {
            showSuccessMessage.value = true
            newPassword.value = ""
            confirmPassword.value = ""
            show_success_toast('Success', 'Password reset successful!');
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } else {
            if(response.validation_error?.new_password) {
                new_password_error.value = response.validation_error?.new_password
            }
            if(response.validation_error?.new_password_confirm) {
                confirm_password_error.value = response.validation_error?.new_password_confirm
            }
            show_error_toast('Error', response.error || 'Something failed while trying to reset your password');
        }
    } catch (error) {
        show_error_toast('Error', 'Something went wrong, please try again.');
    } finally {
        isSending.value = false
    }
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