<template>
  <p>Logged IN :D</p>
  <button type="button" @click=logout>Logout</button>

  <h2 style="margin: 2rem 0 0 10px">Voice Broadcasts</h2>
  <ul class="tab-style">
    <li v-for="option in tab_options" :key="option" class="tab-style__li" 
      :class="[ selected_tab === option ? 'selected-tab' : '' ]" @click="selected_tab = option">
      {{ option }}
    </li>
  </ul>

  <div class="filter-container">
    <div>
      <label for="show" style="margin-right: 6px;">Show:</label>
      <select name="show" id="show" v-model="show">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <div>
      <label for="search" style="margin-right: 6px;">Search:</label>
      <input type="text" name="search" id="search" placeholder="Search..." @input="debounceSearch">
    </div>
  </div>

  <p v-if="isLoading">Loading broadcasts...</p>
  <p v-if="isError">{{ error.message }}</p>
  <ul v-if="isSuccess">
    <li v-for="broadcast in data.broadcast_list" :key="broadcast.id" style="margin: 10px 0;">
      <span style="font-weight: 600; margin-right: 6px;">Broadcast name:</span><span style="margin-right: 10px; color: blue;"> {{ broadcast.name }}</span> 
      <span style="font-weight: 600; margin-right: 6px;">Broadcast ID:</span><span style="margin-right: 10px; color: blue;"> {{ broadcast.broadcast_id }}</span> 
    </li>
  </ul>
</template>
<script setup>
  import { useAuthStore } from "@/stores"

  const authStore = useAuthStore()
  function logout() {
    authStore.logout()
  }

  const tab_options = [COMPLETED, ACTIVE, DRAFT]
  const selected_tab = ref(COMPLETED)
  const show = ref('10')
  const search = ref('')

  const { data, isLoading, isSuccess, isError, error } = useFetchGetBroadcastList(selected_tab, show, search)

  let searchDebounce = null
  const debounceSearch = (e) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      search.value = e.target.value
    }, 500)
  }
</script>

<style scoped>
  .tab-style {
    display: flex;
    list-style-type: none;
    padding: 0;
    gap: 1rem;
    margin-left: 1rem;
  }
  .tab-style__li {
    color: gray;
    background-color: transparent;
    transition: background-color 0.3s;
    font-weight: bold;
    border: 1px solid gray;
    padding: 6px 1rem;
  }
  .tab-style__li:hover {
    cursor: pointer;
    color: white;
    background-color: gray;
  }
  .selected-tab {
    color: white;
    background-color: gray;
  }
  .filter-container {
    display: flex;
    gap: 1.4rem;
    margin: 1rem 0 0 1rem;
  }
</style>