<template>
    <aside class="menu is-flex is-flex-direction-column">
      <div class="logo p-4">Aca el logo</div>
      <ul class="menu-list">
        <li><a :class="is_active('dashboard')">Dashboard</a></li>
        <li><a>Chat</a></li>
        <li><a>Contacts</a></li>
        <li><a>Library</a></li>
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