<template>

    <p>Logged IN :D</p>
    <button type="button" @click=logout>Logout</button>
</template>
<script setup>

import { useAuthStore } from "@/stores"

const authStore = useAuthStore()
function logout() {

  authStore.logout()
}
</script>