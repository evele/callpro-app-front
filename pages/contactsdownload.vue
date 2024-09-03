<template>
  <div>
    <p class="text-title">Download Contact Page</p>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
  </div>
  <h2 style="margin: 2rem 0 0 10px">Contacts</h2>
  <ul class="tab-style">
    <li v-for="option in tab_options" :key="option" class="tab-style__li"
      :class="[selected_tab === option ? 'selected-tab' : '']" @click="selected_tab = option">
      {{ option }}
    </li>
  </ul>
  <div>

    <button @click="downloadContacts">Descargar Contactos</button>
  </div>
</template>

<script setup lang="ts">
const tab_options = [CONTACTS_ALL, UNASSIGNED, TRASH]
const selected_tab = ref(CONTACTS_ALL);
const { refetch,isLoading,isError,error } = useFetchDownloadContacts(selected_tab, false)

const downloadContacts = () => {
  refetch();
};
</script>
<style scoped>
.text-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
}

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
    background-color: orange;
}

.filter-container {
    display: flex;
    gap: 1.4rem;
    margin: 1rem 0 0 1rem;
}
.contact-list {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-collapse: collapse;
}

.contact-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-label {
  font-weight: 600;
  margin-right: 6px;
}

.contact-value {
  margin-right: 10px;
  color: blue;
}
</style>