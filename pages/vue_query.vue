<script setup>
// Access QueryClient instance
// import { useQuery, useQueryClient } from '@tanstack/vue-query'

const { data: settings, error, isLoading, isError } = useFetchSettings()

// const queryClient = useQueryClient()

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
    <li v-for="tz in settings.data.timezones" :key="tz.zones_id">{{ tz.display }}</li>
  </ul>
  <NuxtLink to="chat">
          <button>go to chat</button>
        </NuxtLink>

</template>