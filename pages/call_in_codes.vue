<template>
    <div>
        <p class="text-title">Call in codes page</p>
        <div class="buttons-container">
            <button type="button" @click="load_numbers">Load data</button>
            <button type="button" @click="create_call_in_code(0)">Create a 1 time call in code</button>
            <button type="button" @click="create_call_in_code(1)">Create a call in code</button>
        </div>
        
        <p v-if="isLoading">Loading data...</p>
        <ul v-else>
            <li v-for="code in userCallInCodes" :key="code.id" style="margin: 10px 0;">
                {{ code.call_in_code }}
                <button type="button" @click="delete_code(code.id)">Delete code</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { useCallInCodesStore } from "@/stores"

    const callInCodesStore = useCallInCodesStore()
    const userCallInCodes = computed(() => callInCodesStore.user_call_in_codes)
    const isLoading = ref(false)

    onMounted(async() => {
        await callInCodesStore.loadUserCallInCodes()
    })
    
    const load_numbers = async () => {
        isLoading.value = true
        await callInCodesStore.loadUserCallInCodes()
        isLoading.value = false
    }

    const create_call_in_code = async (value) => {
        const data = { is_static: value }

        isLoading.value = true
        await callInCodesStore.createUserCallInCode(data)
        isLoading.value = false
    }

    const delete_code = async (id) => {
        const code_id = { call_in_code_id: id }

        isLoading.value = true
        await callInCodesStore.deleteUserCallInCode(code_id)
        isLoading.value = false
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .buttons-container {
        display: flex;
        gap: 1rem;
    }
</style>