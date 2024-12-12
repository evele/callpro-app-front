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
            <li><NuxtLink to="caller_id">Caller Id</NuxtLink></li>
            <li><NuxtLink to="chat">Chat</NuxtLink></li>
            <li><NuxtLink to="contacts">Contacts</NuxtLink></li>
            <li><NuxtLink to="dashboard">Dashboard</NuxtLink></li>
            <li><NuxtLink to="did_numbers">Did Numbers</NuxtLink></li>
            <li><NuxtLink to="get_contact">Get Contact</NuxtLink></li>
            <li><NuxtLink to="packages">Packages</NuxtLink></li>
            <li><NuxtLink to="settings">Settings</NuxtLink></li>
            <li><NuxtLink to="sms">Sms</NuxtLink></li>     
          </ul>
        </li>
      </ul>
      <div class="menu-footer p-4">
        <hr>
        <ul class="menu-list">
          <NavLink name="Settings" :icon="SettingsSVG" />
          <NavLink name="Logout" :icon="LogoutSVG" />
        </ul>
      </div>
  </aside>
</template>
<script setup lang="ts">
  import DashboardSVG from "@/components/svgs/DashboardSVG.vue"
  import ChatSVG from "@/components/svgs/ChatSVG.vue"
  import ContactsSVG from "@/components/svgs/ContactsSVG.vue"
  import AudioSVG from "@/components/svgs/AudioSVG.vue"
  import BillingSVG from "@/components/svgs/BillingSVG.vue"
  import SettingsSVG from "@/components/svgs/SettingsSVG.vue"
  import LogoutSVG from "@/components/svgs/LogoutSVG.vue"
  
  type NavLink = {
    name: string
    route?: string
    icon: object
  }

  const LINKS: NavLink[] = [
    { name: "Dashboard", route: "dashboard", icon: DashboardSVG },
    { name: "Chat", route: "chat", icon: ChatSVG },
    { name: "Contacts", route: "contacts", icon: ContactsSVG },
    { name: "Library", route: "audios", icon: AudioSVG },
    { name: "Billing", route: "billing", icon: BillingSVG },
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
</style>