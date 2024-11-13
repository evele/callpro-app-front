<template>
    <Dialog v-model:visible="visible" :draggable="false" @hide="close" class="max-w-[746px] w-[90vw] gap-[38px]">
        <template #header>
            <h2>Call in Audio
                <ChevronDownSVG />
            </h2>
        </template>

        <!-- Botones con espacio entre ellos -->
        <div class="flex flex-col gap-12 px-0 sm:flex-row sm:px-28">
            <Button type="button" @click="create_call_in_code('1')" class="w-full bg-white text-black rounded-xl shadow text-sm border-none hover:bg-black hover:text-white">
                Create a Call In Code
            </Button>
            <Button type="button" @click="create_call_in_code('0')" class="w-full bg-black rounded-xl shadow text-sm border-none hover:bg-white hover:text-black">
                Add 1 Time Call In Code
            </Button>
        </div>

        <!-- Contenedor de tabla con límite de altura y scroll -->
        <div class="w-full max-h-[314px] overflow-y-auto mt-6 mb-10">
            <table class="w-full text-gray-700 border border-gray-200">
                <thead>
                    <tr class="bg-[#653494]">
                        <th
                            class="w-[220px] px-8 text-center text-white text-sm font-medium font-['Roboto'] tracking-tight">
                            Call in codes
                        </th>
                        <th
                            class="w-[220px] px-8 text-center text-white text-sm font-medium font-['Roboto'] tracking-tight">
                            Date Created
                        </th>
                        <th
                            class="w-[60px] px-8 text-center text-white text-sm font-medium font-['Roboto'] tracking-tight">
                        </th>
                    </tr>
                </thead>
                <tbody v-if="userCallInCodes?.user_call_in_codes" class="divide-y divide-gray-200">
                    <tr v-for="(code, index) in userCallInCodes.user_call_in_codes"
                        :key="code.id"
                        :class="[
                            index % 2 === 0 ? 'bg-gray-100' : 'bg-white',
                            'hover:bg-[#9884cf]'
                        ]"
                        class="pt-4 pb-[15px]">
                        <td class="w-[220px] text-center py-2">{{ code.call_in_code }}</td>
                        <td class="w-[220px] text-center py-2">{{ code.date }}</td>                        
                        <td class="w-[60px] py-2">
                            <Button class="bg-gray-200 py-1 px-[6px] border-none text-black hover:bg-[#9884cf] hover:text-white">
                                <TrashSVG class="w-4 h-4" />
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mensajes de carga y error -->
        <p v-if="isLoading" class="text-center my-4 text-gray-500">Loading data...</p>
        <p v-else-if="isError" class="text-center my-4 text-red-500">Error: {{ error?.message }}</p>

        <!-- Panel de información adicional -->
        <InfoPanel class="mt-7">
            <p class="font-bold">You have to call to the number <span class="font-normal">(888) 604 2611</span></p>
            <p class="font-bold">and follow the instructions using the code to add your Call in Audio.</p>
        </InfoPanel>

        <template #footer>
            <Button @click="saveContact"
                class="justify-center items-center w-[300px] mx-auto">
                Close
            </Button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
const { data: userCallInCodes, isError, error, isLoading, isSuccess, refetch } = useFetchCallInCodes()
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
    // const body = document.body;
    // body.style.overflow = 'hidden';
}

// Funciones del componente
const goBack = () => {
    console.log("Going back");
};

const addNew = () => {
    console.log("Adding new phone number");
};

const saveContact = () => {
    console.log("Saving contact");
};

defineExpose({ open });
</script>