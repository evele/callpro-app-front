<template>
    <aside class="menu flex flex-col">
      <div class="logo p-4">Aca el logo</div>
      <ul class="menu-list is-flex is-flex-direction-column ">
        <li><a :class="is_active('dashboard')">Dashboard</a></li>
        <li><a>Chat</a></li>
        <li><a>Contacts</a></li>
        <li><a><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3499 5.60962L6.34926 9.61012H2.34875V15.6109H6.34926L11.3499 19.6114V5.60962Z" stroke="#757575" stroke-width="2.00025" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.4209 5.53961C21.2959 7.41512 22.3492 9.95852 22.3492 12.6105C22.3492 15.2625 21.2959 17.8059 19.4209 19.6814M15.8905 9.07005C16.828 10.0078 17.3546 11.2795 17.3546 12.6055C17.3546 13.9315 16.828 15.2032 15.8905 16.1409" stroke="#757575" stroke-width="2.00025" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
Library</a></li>
        <li><a>Billing</a></li>

      </ul>
      <ul class="menu-list mb-auto">
        <li>
          <a class="is-active">Our Test Pages</a>
          <ul>
            <li><NuxtLink to="audios">Audios</NuxtLink></li>
            <li><NuxtLink to="billing">Billing</NuxtLink></li>
            <li><NuxtLink to="broadcast">Broadcast</NuxtLink></li>
            <li><NuxtLink to="call_in_codes">Call In Codes</NuxtLink></li>
            <li><NuxtLink to="caller_id">Caller Id</NuxtLink></li>
            <li><NuxtLink to="chat">Chat</NuxtLink></li>
            <li><NuxtLink to="dashboard">Dashboard</NuxtLink></li>
            <li><NuxtLink to="did_numbers">Did Numbers</NuxtLink></li>
            <li><NuxtLink to="get_contact">Get Contact</NuxtLink></li>
            <li><NuxtLink to="groups">Groups</NuxtLink></li>
            <li><NuxtLink to="packages">Packages</NuxtLink></li>
            <li><NuxtLink to="save_contact">Save Contact</NuxtLink></li>
            <li><NuxtLink to="settings">Settings</NuxtLink></li>
            <li><NuxtLink to="sms">Sms</NuxtLink></li>     
          </ul>
        </li>
      </ul>
      <div class="menu-footer p-4">
        <hr>
        <ul class="menu-list">
          <li><a>Settings</a></li>
          <li><a @click=logout>Logout</a></li>
        </ul>
      </div>
  </aside>
</template>
<script setup lang="ts">
  import { useAuthStore } from "@/stores"

  const authStore = useAuthStore()
  function logout() {
    authStore.logout()
  }

  const router = useRouter();

  const currentRoute = router.currentRoute;

  const is_active = (route:string) => currentRoute.value.name == route?"is-active": "" 
  
</script>