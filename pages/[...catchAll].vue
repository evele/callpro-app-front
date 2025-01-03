<template>
    <div>
      <p>You are being redirected...</p>
    </div>
</template>
  
<script setup lang="ts">
  import { useAuthStore } from "@/stores";
  const authStore = useAuthStore();
  
  if (authStore.isLoggedIn) {
    navigateTo("/dashboard", { replace: true });
  } else {
    navigateTo("/login", { replace: true });
  }
</script>