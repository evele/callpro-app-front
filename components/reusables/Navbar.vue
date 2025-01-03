<template>
  <aside>
    <div class="flex flex-col w-[250px] border border-[#DED8E1] justify-between pt-14 sticky top-0 h-screen z-[1000]">
      <div class="flex flex-col items-center gap-14">
        <NuxtLink to="dashboard">
          <img src="@/assets/png/thecallpro.png" alt="The CallPro Logo"  class="w-[120px] h-9 mx-auto" />
        </NuxtLink>
        <ul class="flex flex-col p-0 items-center gap-[18px]">
          <NavLink v-for="link in LINKS" :key="link.name" :name="link.name" :route="link.route" :icon="link.icon" />
        </ul>
      </div>
      
      <div class="p-4">
        <Divider class="!h-[2.5px] bg-[#DED8E1] rounded-full"/>
        <ul class="flex flex-col p-0 items-center gap-4">
          <NavLink name="Settings" route="settings" :icon="SettingsSVG" />
          <NavLink name="Logout" :icon="LogoutSVG" />
        </ul>
      </div>
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