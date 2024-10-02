<template>
    <div>
        <h2>Reset Your Password</h2>
        <form @submit.prevent="resetPassword">
            <div>
                <label for="new-password">New Password</label>
                <input id="new-password" type="password" v-model="newPassword" placeholder="Enter new password"
                    tabindex="1" @input="validatePassword" />
                <span v-if="passwordErrors.length" class="error-msg">
                    <ul>
                        <li v-for="(error, index) in passwordErrors" :key="index">{{ error }}</li>
                    </ul>
                </span>
            </div>

            <div>
                <label for="confirm-password">Confirm Password</label>
                <input id="confirm-password" type="password" v-model="confirmPassword"
                    placeholder="Confirm your password" tabindex="2" @input="validateConfirmPassword" />
                <span v-if="confirmPasswordError" class="error-msg">{{ confirmPasswordError }}</span>
            </div>

            <button type="submit" :disabled="!formIsValid">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores"

const newPassword = ref("")
const confirmPassword = ref("")

const passwordErrors = ref([])
const confirmPasswordError = ref("")
const formIsValid = ref(false)

function validatePassword() {
    passwordErrors.value = []

    if (newPassword.value.length < 8) {
        passwordErrors.value.push("The password must be at least 8 characters long.")
    }
    if (!/\d/.test(newPassword.value)) {
        passwordErrors.value.push("The password must contain at least one number.")
    }

    validateForm()
}

function validateConfirmPassword() {
    if (newPassword.value !== confirmPassword.value) {
        confirmPasswordError.value = "Passwords do not match."
    } else {
        confirmPasswordError.value = ""
    }
    validateForm()
}

function validateForm() {
    formIsValid.value =
        passwordErrors.value.length === 0 &&
        confirmPasswordError.value === "" &&
        newPassword.value !== "" &&
        confirmPassword.value !== ""
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

async function resetPassword() {
    validatePassword()
    validateConfirmPassword()

    if (!formIsValid.value) {
        return
    }

    try {
        const token = route.params.token
        const response = await authStore.resetPassword(newPassword.value, newPassword.value, token)

        if (response.result) {
            console.log("Password reset successful")
            router.push("/login")
        } else {
            console.error("Error:", response.errors)
        }
    } catch (error) {
        console.error("An error occurred:", error)
    }
}
</script>

<style scoped>
.error-msg {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>