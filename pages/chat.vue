<template>
    <div>
        <p class="text-title">Chat page</p>
        <Button label="Reload data" icon="pi pi-refresh" class="button is-info" @click="load_data" />
        <div class="container-div">
            <p>Get all contacts</p>
            <input type="checkbox" v-model="get_all_contacts">
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useQueryClient } from '@tanstack/vue-query'

    const queryClient = useQueryClient()

    const get_all_contacts = ref(true)

    const { data: unreadMessagesData } = useFetchUnreadMessages()
    const { data: chatContactsData } = useFetchChatContacts(get_all_contacts)
    
    const load_data = () => {
        queryClient.invalidateQueries({ queryKey: [UNREAD_CHAT_MESSAGES] });
    }
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