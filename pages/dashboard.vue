<template>
  <section class="bg-white py-1 pl-8">
    <p class="text-2xl font-semibold">New voice broadcast</p>
  </section>

  <div class="px-6">
    <BroadcastLayout />
  </div>
</template>
<script setup lang="ts">
import {useGeneralStore} from "@/stores"
  const generalStore = useGeneralStore()
  
  onMounted(async () => {
    await Promise.all([
      generalStore.getUserAreaCodesAndTimezonesData(),
      generalStore.getUserTimezone()
    ])
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