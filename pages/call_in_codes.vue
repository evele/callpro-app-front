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
            <li v-for="code in userCallInCodes.user_call_in_codes" :key="code.id" style="margin: 10px 0;">
                {{ code.call_in_code }}
                <button type="button" @click="delete_code(code.id)">Delete code</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { useCallInCodesStore } from "@/stores"
    import { useQueryClient, useMutation} from '@tanstack/vue-query'
    
    const callInCodesStore = useCallInCodesStore()
    // const userCallInCodes = computed(() => callInCodesStore.user_call_in_codes)
    // const isLoading = ref(false)
    const { data: userCallInCodes, error, isLoading, isError } = useFetchCallInCodes()


    onMounted(async() => {
        // await callInCodesStore.getUserCallInCodes()
    })
    
    const load_numbers = async () => {
        // isLoading.value = true
        await callInCodesStore.getUserCallInCodes()
        // isLoading.value = false
    }
    
    // const { mutate: createCallInCode } = useCreateCallinCode()
    const queryClient = useQueryClient()
    const { mutate: createCallInCode } = useMutation({
        mutationFn: (data) => fetchWrapper.post(CREATE_CALL_IN_CODE_URL,data),
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['call_in_codes'] })
        },
    }) 
    const create_call_in_code = async (value) => {
        const data = { is_static: value }

        // isLoading.value = true
        // await callInCodesStore.createUserCallInCode(data)
        createCallInCode(data)
        // isLoading.value = false
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