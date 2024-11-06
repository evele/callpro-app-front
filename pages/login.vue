<template>
  <div class="bg-[#E6E0E9] flex items-center justify-center min-h-screen rounded-3xl">
      <div class="max-w-[850px] w-[90vw] px-auto justify-items-center">
          <Card class="w-full flex flex-col items-center justify-center font-normal gap-10">
              <!-- Bloque de logo y texto -->
              <template #header>
                  <div class="mt-14 flex flex-col items-center">
                      <img alt="user header" src="@/assets/png/thecallpro.png"
                          class="flex-shrink-0 bg-cover bg-center" />
                      <p class="text-xl text-[#4f378b] mt-6">Log in to your dashboard</p>
                  </div>
              </template>

              <template #content>
                  <!-- Formulario de Login -->
                  <form @keydown.enter.prevent="login" 
                  class="flex flex-col gap-10 w-full max-w-[520px] sm:w-[90vw] mx-auto">
                      <!-- Bloque de Email -->
                      <div class="flex flex-col items-start gap-2 w-full">
                          <label for="email">Email</label>
                          <InputText id="email"
                              class="flex w-full py-3 border"
                              autocomplete="off" placeholder="Enter your email" v-model="email" />
                      </div>

                      <!-- Bloque de Password -->
                      <div class="flex flex-col items-start gap-2 w-full">
                          <label for="password">Password</label>
                          <InputText id="password" type="password"
                              class="flex w-full py-3 border"
                              autocomplete="off" 
                              placeholder="Enter your password" v-model="password" />                                                   
                      </div>
                      <!-- Bloque de "Forgot your Password" -->
                      <div class="flex justify-center text-[#4f378b] font-semibold">
                        <router-link to="/forgot_password" >
                              Forgot your Password?
                          </router-link>                           
                      </div>
                  </form>
              </template>

              <template #footer>
                  <div class="flex flex-col gap-4 mt-14">
                      <Button type="button" 
                        class="flex justify-center items-center py-2 w-[300px] mx-auto"
                          :disabled="isPending" @click.prevent="login">
                          {{ isPending ? 'Logging in...' : 'Login' }}
                      </Button>
                      <div
                          class="flex justify-between w-full max-w-[600px] mx-auto text-[#4f378b] text-xs font-semibold gap-4 mt-14 mb-14">
                          <!-- <span class="left-text">Sign up today</span> -->
                          <router-link to="/create_user">
                              Sign up today
                          </router-link>
                          <!-- <span class="right-text">Bind your Phone Launch Account</span> -->
                          <router-link to="/login_2">
                              Bind your Phone Launch Account
                          </router-link>
                      </div>
                  </div>
              </template>
              <!-- Contenedor de los textos -->

          </Card>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores"

definePageMeta({
  layout: false,
})

const email = ref('');
const password = ref('');

const isPending = ref(false);

const authStore = useAuthStore();


function login() {
  console.log('data', email.value, password.value);
  isPending.value = true;
  authStore.login({ email: email.value, password: password.value })
      .then((response) => {
          isPending.value = false;
          if ("result" in response && !response.result) {              
              console.log('Error en el login:', response.error || response.validation_error);
          }else if ("result" in response && response.result) {
            
            console.log('Login exitoso:');
            }

      })
      .catch(() => {
          isPending.value = false;
          console.log('Error al intentar iniciar sesión');
      });
}


</script>