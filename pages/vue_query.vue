<script setup>
// Access QueryClient instance
const queryClient = useQueryClient()

// Query
const { isLoading, isError, data, error } = useQuery({
  queryKey: ['settings'],
  queryFn: () => fetchWrapper.get(GET_SETTINGS_DATA_URL) , // Use $fetch with your api routes to get typesafety 
})
console.log("data: ",data)

/*
// Mutation
const { mutate } = useMutation({
  mutationFn: (newTodo) => $fetch("/api/todos", { method: "POST", body: newTodo }),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
}) 

function onButtonClick() {
   mutate({
    id: Date.now(),
    title: 'Do Laundry',
  })
} */
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <!-- We can assume by this point that `isSuccess === true` -->
  <ul v-else>
    <li v-for="tz in data.data.timezones" :key="tz.zones_id">{{ tz.display }}</li>
  </ul>
  <button @click="onButtonClick">Add Todo</button>
  <VueQueryDevtools />
</template>