<template>
    <div>
        <p class="text-title">Chat page</p>
        <button type="button" @click="load_numbers">Load data</button>
        <div class="container-div">
            <p>Get all contacts</p>
            <input type="checkbox" v-model="get_all_contacts">
        </div>
        <p v-if="!isLoading">{{ settings?.data.max_retries }}</p>
        <p v-else>{{  isLoading }}</p>
    </div>
</template>

<script setup>
    import { useSmsStore } from "@/stores"

    const smsStore = useSmsStore()
    const get_all_contacts = ref(true)

    onMounted(async() => {
        Promise.all([
            smsStore.getUnreadMessages(),
            smsStore.getChatContacts(get_all_contacts.value)
        ])
    })
    
    const load_numbers = () => {
        Promise.all([
            smsStore.getUnreadMessages(),
            smsStore.getChatContacts(get_all_contacts.value)
        ])
    }

    const { data:settings, error, isLoading, isError } = useFetchSettings()

    
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .container-div {
        display: flex;
        align-items: center;
        font-size: 18px;
    }
</style>