<template>
  <aside>
    <div 
      class="flex flex-col border border-[#DED8E1] justify-between pt-14 sticky top-0 h-screen z-[1000] transition-all duration-300 ease-in-out"
      :class="[collapse ? 'w-[116px]' : 'w-[250px]']"  
    >
      <div class="flex flex-col items-center gap-14">
        <div class="flex items-center w-full px-4" :class="[collapse ? 'justify-center gap-1' : 'justify-end gap-10']">
          <Transition name="slide-fade">
            <NuxtLink v-show="!collapse" to="dashboard">
              <img src="@/assets/png/thecallpro.png" alt="The CallPro Logo"  class="w-[120px] h-9 mx-auto" />
            </NuxtLink>
          </Transition>
          <div v-if="collapse" class="h-9"></div>

          <ExpandSVG v-if="collapse" class="min-w-5 min-h-5 text-dark-5 cursor-pointer hover:scale-110 transition-transform" @click="toggle_collapse" />
          <CollapseSVG v-else class="min-w-5 min-h-5 text-dark-5 cursor-pointer hover:scale-110 transition-transform" @click="toggle_collapse" />
        </div>
        <ul class="flex flex-col p-0 items-center gap-[18px]">
          <NavLink v-for="link in LINKS" :key="link.name" :name="link.name" :route="link.route" :icon="link.icon" :is-collapsed="collapse" v-tooltip.right="collapse?link.name:''" />
        </ul>
      </div>
      
      <div class="p-4">
        <Divider class="!h-[2.5px] bg-[#DED8E1] rounded-full"/>
        <ul class="flex flex-col p-0 items-center gap-4">
          <NavLink name="Settings" route="settings" :icon="SettingsSVG" :is-collapsed="collapse" v-tooltip.right="collapse?'Settings':''" />
          <NavLink name="Logout" :icon="LogoutSVG" :is-collapsed="collapse" v-tooltip.right="collapse?'Logout':''" />
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

const collapse = ref(false)
const toggle_collapse = () => collapse.value = !collapse.value

type NavLink = {
  name: string
  route?: string
  icon: object
}

const LINKS: NavLink[] = [
  { name: "Dashboard", route: "dashboard", icon: DashboardSVG },
  { name: "Chat", route: "chat", icon: ChatSVG },
  { name: "Contacts", route: "contacts", icon: ContactsSVG },
  { name: "Library", route: "library", icon: AudioSVG },
  { name: "Billing", route: "billing", icon: BillingSVG },
]
</script>
<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>