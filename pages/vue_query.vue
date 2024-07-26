<script setup>

const { data: settings, error, isLoading, isError } = useFetchSettings()

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