<template>
  <p>Logged IN :D</p>
  

  <h2 style="margin: 2rem 0 0 10px">Voice Broadcasts</h2>
  <ul class="tab-style">
    <li v-for="option in tab_options" :key="option" class="tab-style__li" 
      :class="[ selected_tab === option ? 'selected-tab' : '' ]" @click="selected_tab = option">
      {{ option }}
    </li>
  </ul>

  <div class="filter-container">
    <div style="width: 75px;">
      <Select v-model="selected_items_per_page" :options="select_options" optionLabel="name" class="p-2 is-flex is-justify-content-space-between is-fullwidth has-background-white has-text-grey-darker">
        <template #option="slotProps">
          <div class="has-background-white">
            <span class="p-2 has-text-grey-darker">{{ slotProps.option.name }}</span>
          </div>
        </template>
      </Select>
    </div>

    <div>
      <label for="search" style="margin-right: 6px;">Search:</label>
      <input type="text" name="search" id="search" placeholder="Search..." @input="debounceSearch">
    </div>
  </div>

  <p v-if="isLoading">Loading broadcasts...</p>
  <p v-if="isError">{{ error?.message }}</p>
  <ul v-if="isSuccess && data && 'broadcast_list' in data">
    <li v-for="broadcast in data?.broadcast_list" :key="broadcast?.broadcast_id" style="margin: 10px 0;">
      <span style="font-weight: 600; margin-right: 6px;">Broadcast name:</span><span style="margin-right: 10px; color: blue;"> {{ broadcast.name }}</span> 
      <span style="font-weight: 600; margin-right: 6px;">Broadcast ID:</span><span style="margin-right: 10px; color: blue;"> {{ broadcast.broadcast_id }}</span> 
    </li>
  </ul>
</template>
<script setup lang="ts">
import {useGeneralStore} from "@/stores"
  const generalStore = useGeneralStore()
  
  onMounted(() => {
    generalStore.getUserAreaCodesAndTimezonesData()
  })

  const tab_options: DashboardState[] = [COMPLETED, ACTIVE, DRAFT]
  const selected_tab: Ref<DashboardState> = ref(COMPLETED)
  const select_options: Ref<ItemsPerPageOption[]> = ref([
    { name: '10', code: 10 },
    { name: '25', code: 25 },
    { name: '50', code: 50 },
    { name: '100', code: 100 }
  ])
  const selected_items_per_page: Ref<ItemsPerPageOption> = ref({ name: '10', code: 10 })
  const search = ref('')

  const { data, isLoading, isSuccess, isError, error } = useFetchGetBroadcastList(selected_tab, selected_items_per_page, search)

  let searchDebounce: ReturnType<typeof setTimeout>
  const debounceSearch = (e: Event) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      const target = e.target as HTMLInputElement;
      search.value = target.value
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