<template>
    <div class="flex flex-col gap-12 px-0 sm:flex-row sm:px-28 mb-6">
        <Button type="button" @click="create_call_in_code('1')" :disabled="is_creating_code"
            class="w-full bg-white text-black rounded-xl shadow text-sm border-none hover:bg-black hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-black">
            Create a Call In Code
        </Button>
        <Button type="button" @click="create_call_in_code('0')" :disabled="is_creating_code"
            class="w-full bg-black rounded-xl shadow text-sm border-none hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-black">
            Add 1 Time Call In Code
        </Button>
    </div>

    <p v-if="isError" class="text-center my-4 text-red-500">Error: {{ errorMessage }}</p>
    <ProgressBar v-if="isFetching" mode="indeterminate" style="height: 6px"></ProgressBar>
    
    <div class="w-full max-h-[314px] overflow-y-auto mb-10 rounded-tl-xl rounded-tr-xl">
        <table v-if="userCallInCodes && 'user_call_in_codes' in userCallInCodes" class="w-full text-gray-700 border border-gray-200 ">
            <thead class="sticky top-0 z-[100]">
                <tr class="bg-[#653494] h-[38px] ">
                    <th class="px-4 text-center text-white text-sm font-medium w-24">
                        One Time
                    </th>
                    <th class="px-4 text-center text-white text-sm font-medium">
                        Call in codes
                    </th>
                    <th class="px-4 text-center text-white text-sm font-medium">
                        Date Created
                    </th>
                    <th class="px-8 text-center text-white text-sm font-medium w-24">
                    </th>
                </tr>
            </thead>
            <tbody  class="divide-y divide-gray-200">
                <tr v-for="(code, index) in userCallInCodes.user_call_in_codes" :key="code.id" 
                    :class="[index % 2 === 0 ? 'bg-gray-100' : 'bg-white', 'hover:bg-[#9884cf] hover:text-white']" 
                    class="pt-4 pb-[15px] h-16">
                    <td class="text-center w-24"><CheckSVG v-if="code.is_static=='0'" class="m-auto w-6 h-6"></CheckSVG></td>
                    <td class="text-center">{{ code.call_in_code }}</td>
                    <td class="text-center">{{ code.date }}</td>
                    <td class="text-center w-24">
                        <Button @click="delete_code(code?.id)" :disabled="is_deleting"
                            class="p-2 bg-gray-200 border-none text-black hover:bg-gray-300 hover:scale-105"
                        >
                            <TrashSVG class="w-6 h-6" />
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <InfoPanel>
        <p >You have to call to the number <span class="font-bold">(888) 604 2611</span>and follow the instructions using the code to add your Call in Audio.</p>            
    </InfoPanel>

    <footer class="flex justify-center w-full font-bold mt-[38px]">
        <Button @click="emit('close')" class="w-[300px]">
            Close
        </Button>
    </footer>
</template>
<script setup lang="ts">

const { data: userCallInCodes, isError, error: errorMessage, isFetching } = useFetchCallInCodes()
const { mutate: createCallInCode, isPending: is_creating_code } = useCreateCallInCode()
const { mutate: deleteCallInCode, isPending: is_deleting } = useDeleteCallInCode()

const emit = defineEmits(['close', 'success', 'error'])

const create_call_in_code = (value: ZeroOrOne) => {
    const data = { is_static: value }
    createCallInCode(data, {
        onSuccess: (response: CreateCallInCodeResponse | APIResponseError) => {
            if(response.result) {
                emit('success', 'Call in code created successfully')
            } else {
                emit('error', 'Error creating call in code')
            }
        },
        onError: () => emit('error', 'Error creating call in code'),
    })
}

const delete_code = (id: number) => {
    const code_id = { call_in_code_id: id }
    deleteCallInCode(code_id, {
        onSuccess: (response: APIResponseSuccess | APIResponseError) => {
            if(response.result) {
                emit('success', 'Call in code deleted successfully')
            } else {
                emit('error', 'Error deleting call in code')
            }
        },
        onError: () => emit('error', 'Error deleting call in code'),
    })
}
</script>