<template>
    <aside class="menu flex flex-col">
      <div class="logo p-4">Aca el logo</div>
      <ul class="menu-list">
        <li class="nav-link" :class="is_active('dashboard')"><a><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3499 5.60962L6.34926 9.61012H2.34875V15.6109H6.34926L11.3499 19.6114V5.60962Z" stroke="#FFFFFF" stroke-width="2.00025" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.4209 5.53961C21.2959 7.41512 22.3492 9.95852 22.3492 12.6105C22.3492 15.2625 21.2959 17.8059 19.4209 19.6814M15.8905 9.07005C16.828 10.0078 17.3546 11.2795 17.3546 12.6055C17.3546 13.9315 16.828 15.2032 15.8905 16.1409" stroke="#FFFFFF" stroke-width="2.00025" stroke-linecap="round" stroke-linejoin="round"/>
</svg><span>Dashboard</span></a></li>
        <li class="nav-link"><a>Chat</a></li>
        <li class="nav-link"><a>Contacts</a></li>
        <li class="nav-link"><a><AudioSVG/>
<span>Library</span></a></li>
        <li class="nav-link"><a>Billing</a></li>

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

  const authStore = useAuthStore()
  function logout() {
    authStore.logout()
  }
  

  const router = useRouter();

  const currentRoute = router.currentRoute;

  const is_active = (route:string) => currentRoute.value.name == route?"nav-link--active": "" 
  
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