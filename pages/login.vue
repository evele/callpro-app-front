<template>
 
          <div>
            <form @keydown.enter.prevent="login">
              <label>Email
                <input type="text" v-model="email" tabindex="1" ></input>
              </label>
              <label>Password
                <input type="password" v-model="password" tabindex="2"></input>
              </label>
              <button type="submit" @click.prevent="login">Login</button>
            </form>
          </div>
</template>

<script setup>
  import { useAuthStore } from "@/stores"

  definePageMeta({
    layout: false,
  })
  
  const email = ref("")
  const password = ref("")

  
  const authStore = useAuthStore()
  function login() {
    console.log("data", email.value, password.value)
    authStore.login({ email: email.value, password: password.value }).then((response) => {
      if (!response.result) {
        console.log("ups dont work", response.errors);
      } 
    })
  }

</script>
