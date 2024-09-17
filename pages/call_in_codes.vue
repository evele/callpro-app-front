import { UserCallInCode } from '../utils/api-calls/call_in_code';
<template>
    <div>
        <p class="text-title">Call in codes page</p>
        <div class="buttons-container">
            <button type="button" @click="load_numbers">Load data</button>
            <button type="button" @click="create_call_in_code('0')">Create a 1 time call in code</button>
            <button type="button" @click="create_call_in_code('1')">Create a call in code</button>
        </div>
        
        <p v-if="isLoading">Loading data...</p>
        <p v-else-if="isError">Error: {{ error?.message }}</p>        
        <ul v-if="isSuccess && userCallInCodes && 'user_call_in_codes' in userCallInCodes">
            <li v-for="code in userCallInCodes?.user_call_in_codes" :key="code?.id" style="margin: 10px 0;">
                {{ code?.call_in_code }}
                <button type="button" @click="delete_code(code?.id)">Delete code</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    
    const { data: userCallInCodes,isError, error, isLoading, isSuccess, refetch } = useFetchCallInCodes()

    const load_numbers = () => {
        refetch()
    }
    
    const { mutate: createCallInCode } = useCreateCallInCode()
    const { mutate: deleteCallInCode } = useDeleteCallInCode()
    
    const create_call_in_code = (value: ZeroOrOne) => {
        const data = { is_static: value }
        createCallInCode(data)
    }

    const delete_code = (id: number) => {
        const code_id = { call_in_code_id: id }
        deleteCallInCode(code_id)
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