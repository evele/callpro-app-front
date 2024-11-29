<template>
    <Dialog v-model:visible="visible" :draggable="false" @hide="close" class="max-w-[746px] w-[90vw] gap-[38px]">
        <template #header>
            <h2>Call in Audio
                <ChevronDownSVG />
            </h2>
        </template>

        <div class="flex flex-col gap-12 px-0 sm:flex-row sm:px-28">
            <Button type="button" @click="create_call_in_code('1')"
                class="w-full bg-white text-black rounded-xl shadow text-sm border-none hover:bg-black hover:text-white">
                Create a Call In Code
            </Button>
            <Button type="button" @click="create_call_in_code('0')"
                class="w-full bg-black rounded-xl shadow text-sm border-none hover:bg-white hover:text-black">
                Add 1 Time Call In Code
            </Button>
        </div>

        <div class="w-full max-h-[314px] overflow-y-auto mt-6 mb-10   rounded-tl-xl rounded-tr-xl">
            <p v-if="isLoading" class="text-center my-4 text-gray-500">Loading data...</p>
            <p v-else-if="isError" class="text-center my-4 text-red-500">Error: {{ errorMessage }}</p>
            <div v-else>
                <table v-if="userCallInCodes && 'user_call_in_codes' in userCallInCodes" class="w-full text-gray-700 border border-gray-200 ">
                    <thead>
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
                            :class="[index % 2 === 0 ? 'bg-gray-100' : 'bg-white','hover:bg-[#9884cf]']" 
                            class="pt-4 pb-[15px] h-16">
                            <td class="text-center w-24"><CheckSVG v-if="code.is_static=='0'" class="m-auto w-6 h-6"></CheckSVG></td>
                            <td class="text-center">{{ code.call_in_code }}</td>
                            <td class="text-center">{{ code.date }}</td>
                            <td class="text-center w-24">
                                <Button
                                    @click="delete_code(code?.id)"
                                    class="bg-gray-200 py-1 px-[6px] border-none text-black hover:bg-[#9884cf] hover:text-white">
                                    <TrashSVG class="w-6 h-6" />
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <p v-if="isLoading" class="text-center my-4 text-gray-500">Loading data...</p>
        <p v-else-if="isError" class="text-center my-4 text-red-500">Error: {{ errorMessage?.message }}</p>
        
        <InfoPanel>
            <p >You have to call to the number <span class="font-bold">(888) 604 2611</span>and follow the instructions using the code to add your Call in Audio.</p>            
        </InfoPanel>

        <template #footer>
            <Button @click="close" class="justify-center items-center w-[300px] mx-auto">
                Close
            </Button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">

const { data: userCallInCodes, isError, error: errorMessage, isLoading, isSuccess, refetch } = useFetchCallInCodes()
const { mutate: createCallInCode } = useCreateCallInCode()
const { mutate: deleteCallInCode } = useDeleteCallInCode()

const visible = ref(false);
const contact_numbers = ref<string[]>([]);
const isPending = ref(false);

const create_call_in_code = (value: ZeroOrOne) => {
    const data = { is_static: value }
    createCallInCode(data)
}

const delete_code = (id: number) => {
    const code_id = { call_in_code_id: id }
    deleteCallInCode(code_id)
}

const open = () => {
    visible.value = true;
}

const close = () => {       
        visible.value = false   
}
defineExpose({ open });
</script>