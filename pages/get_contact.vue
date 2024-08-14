<template>
    <p class="text-title">Contact page</p>
    <div>
        <input type="text" placeholder="Search for Contact ID" v-model="contact_id">
        <button type="button" @click="search_contact_data">Search</button>
        <span v-if="isLoading">Loading contact data...</span>
        <span v-else-if="isError">Something failed while getting contact data.</span>
        <div v-if="isSuccess">
            <div v-if="data.result">
                <p v-if="!data.contact_data.length">No contact found.</p>
                <div v-else>
                    <p>First Name: {{ data?.contact_data[0]?.first_name }}</p>
                    <p>Last Name: {{ data?.contact_data[0]?.last_name }}</p>
                    <p>Number: {{ data?.contact_data[0]?.number }}</p>
                    <p>Notes: {{ data?.contact_data[0]?.notes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const contact_id = ref('')

    const { data, isLoading, isSuccess, isError, refetch } = useFetchContact(contact_id)

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