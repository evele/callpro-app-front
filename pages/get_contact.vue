<template>
    <p class="text-title">Contact page</p>
    <div>
        <input type="text" placeholder="Search for Contact ID" v-model="contact_id" @input="handle_input">
        <button type="button" class="button is-primary" @click="search_contact_data">Search</button>
        <span v-if="isLoading">Loading contact data...</span>
        <span v-else-if="isError">Something failed while getting contact data. Error: {{ error?.message }}</span>
        <div v-if="isSuccess && data && 'contact_data' in data">
            <div v-if="data?.result">
                <p v-if="!data?.contact_data">No contact found.</p>
                <div v-else>
                    <p>First Name: {{ data?.contact_data?.first_name }}</p>
                    <p>Last Name: {{ data?.contact_data?.last_name }}</p>
                    <p>Number: {{ data?.contact_data?.number }}</p>
                    <p>Notes: {{ data?.contact_data?.notes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const contact_id = ref('')

    const { data, isLoading, isSuccess, isError, error, refetch } = useFetchContact(contact_id)

    const handle_input = (e: Event) => {
        const target = e.target as HTMLInputElement
        contact_id.value = target.value.replace(/[^0-9]/g, '')
    }

    const search_contact_data = () => {
        refetch()
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>