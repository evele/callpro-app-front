<template>
    <div>
        <form @keydown.enter.prevent="requestPasswordReset">
            <label>Email
                <input type="text" v-model="email" placeholder="Enter your email" tabindex="1"></input>
            </label>
            <button type="submit" @click.prevent="requestPasswordReset">Request Password Reset</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores"

definePageMeta({
    layout: false,
})

const email = ref("")

const authStore = useAuthStore()

async function requestPasswordReset() {
    try {        
        const response = await authStore.sendRecoveryPass(email.value)
        if (response.result) {
            console.log("Email sent for password reset")
        } else {
            console.log("Error:", response.errors)
        }
    } catch (error) {
        console.error("An error occurred:", error)
    }
}
</script>