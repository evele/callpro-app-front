<template>
    <aside class="menu flex flex-col">
      <div class="logo p-4">Aca el logo</div>
      <ul class="menu-list">
        <NavLink v-for="link in LINKS" :key="link.name" :name="link.name" :route="link.route" :icon="link.icon" />
      </ul>
      <ul class="menu-list mt-8 mb-auto">
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
  import AudioSVG from "@/components/svgs/AudioSVG.vue"

  const authStore = useAuthStore()
  function logout() {
    authStore.logout()
  }
  
  type NavLink = {
    name: string
    route: string
    icon: object
  }

  const LINKS: NavLink[] = [
    { name: "Dashboard", route: "dashboard", icon: AudioSVG },
    { name: "Chat", route: "chat", icon: AudioSVG },
    { name: "Contacts", route: "contacts", icon: AudioSVG },
    { name: "Library", route: "#", icon: AudioSVG },
    { name: "Billing", route: "billing", icon: AudioSVG },
  ]
</script>
<style>

  .menu {
    width: 250px;
    border: 1px solid #DED8E1;
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    padding: 0;
    align-items: center;
    gap: 18px;
  }

 .nav-link {
    padding: 0.75rem;
    list-style-type: none;
    border-radius: 1.25rem;
    width: 172px;
    height: 45px;
    display: flex;
    align-items: center;
    padding-left: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5rem;
  }
  .nav-link:hover {
    background-color: #EEEEEE;
  }

  .nav-link--active {
    background-color: #653494;
    color: #ffffff;
  }

  .nav-link--active:hover {
    background-color: #8244bc;
  }

  .nav-link a {
    display: flex;
    width: 100%;
  }

  .nav-link span {
    width: 100%;
    text-align: center;
  }

</style>