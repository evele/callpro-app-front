<template>
    <div>
        <p class="text-title">SMS page</p>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error?.message }}</span>

        <!-- <button type="button" @click="load_settings">Load settings</button> -->
    </div>
    <h2 style="margin: 2rem 0 0 10px">Text Broadcasts</h2>
    <ul class="tab-style">
        <li v-for="option in tab_options" :key="option" class="tab-style__li"
            :class="[selected_tab === option ? 'selected-tab' : '']" @click="selected_tab = option">
            {{ option }}
        </li>
    </ul>
    <div class="filter-container">
        <div>
            <label for="show" style="margin-right: 6px;">Show:</label>
            <select name="show" id="show" v-model="show">
                <option value=10>10</option>
                <option value=25>25</option>
                <option value=50>50</option>
                <option value=100>100</option>
            </select>
        </div>

        <div>
            <label for="search" style="margin-right: 6px;">Search:</label>
            <input type="text" name="search" id="search" placeholder="Search..." v-model="search">
        </div>
    </div>
    <p v-if="isLoading">Loading broadcasts...</p>
    <p v-if="isError">{{ error?.message }}</p>
    <ul v-if="isSuccess" class="sms-list">
        <li v-for="sms in sms_list_data" :key="sms.sms_id" class="sms-item">
            <span class="sms-label">SMS name:</span><span class="sms-value">{{ sms.name }}</span>
            <span class="sms-label">SMS ID:</span><span class="sms-value">{{ sms.sms_id }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useFetchSms } from '#imports';

const show = ref(10)
const search = useDebouncedRef("", 500)
const tab_options = [COMPLETED, ACTIVE, DRAFT]
const selected_tab = ref(COMPLETED)


const { data, error, isSuccess, isLoading, isError } = useFetchSms(selected_tab, show, search)
const sms_list_data = computed(() => data?.value?.sms_list || []);


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
.sms-list {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-collapse: collapse;
}

.sms-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.sms-item:last-child {
  border-bottom: none;
}

.sms-label {
  font-weight: 600;
  margin-right: 6px;
}

.sms-value {
  margin-right: 10px;
  color: blue;
}
</style>