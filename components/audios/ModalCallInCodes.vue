<template>
    <Dialog v-model:visible="visible" pt:root:class="modal" modal header="Call in Audio"
        class="w-full max-w-[746px] shadow flex-col justify-center items-center inline-flex">
        <div class="flex flex-col gap-4">
            <button class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                Create a Call In Code
            </button>
            <button class="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                Add 1 Time Call In Code
            </button>
            <div class="text-sm">
                <!-- Aquí se agregan los otros elementos de texto, inputs u otros componentes según sea necesario -->
                <p>Otros elementos aquí</p>
            </div>
        </div>

        <div class="w-full max-w-[654px] flex flex-col items-center  text-sm gap-9">
            <div class="w-full overflow-y-auto max-h-[calc(50vh-80px)] border border-gray-200">
                <!-- Tabla completa con encabezado y cuerpo -->
                <table class="w-full  text-gray-700 border border-gray-200">
                    <!-- Encabezado de la tabla -->
                    <thead>
                        <tr class="bg-[#653494] rounded-tl-md rounded-tr-md">
                            <th
                                class="w-[220px] px-8 text-center text-white text-sm font-medium font-['Roboto'] tracking-tight">
                                Call in codes
                            </th>
                            <th
                                class="w-[220px] px-8 text-center text-white text-sm font-medium font-['Roboto'] tracking-tight">
                                Date Created
                            </th>
                        </tr>
                    </thead>

                    <!-- Cuerpo de la tabla -->
                    <tbody
                        v-if="userCallInCodes && 'user_call_in_codes' in userCallInCodes && userCallInCodes.user_call_in_codes">
                        <tr v-for="code in userCallInCodes.user_call_in_codes" :key="code.id"
                            class="border-b border-gray-200">
                            <td class="w-[220px]  text-center py-2">{{ code.call_in_code }}</td>
                            <td class="w-[220px]  text-center py-2">{{ code.date }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Mensajes de carga y error -->
            <p v-if="isLoading" class="text-center my-4 text-gray-500">Loading data...</p>
            <p v-else-if="isError" class="text-center my-4 text-red-500">Error: {{ error?.message }}</p>
            <div
                className="w-full max-w-[654px] px-2.5 pt-4 pb-3.5 bg-[#4f378b]/20 rounded-tl-[10px] rounded-tr-[10px] border-b border-[#9747ff] justify-center items-center inline-flex">
                <div className="w-full">
                    <span style="text-[#1e1e1e] text-sm font-normal">You have to call to the
                        number </span><span style="text-[#1e1e1e] text-sm font-semibold">(888) 604 2611
                    </span>
                    <span style="text-[#1e1e1e] text-sm font-normal ">and follow the
                        instructions using the code to add your Call in Audio.</span>
                </div>
            </div>
        </div>

        <template #footer>
            <footer class="flex flex-col w-full justify-center gap-4 sm:gap-6 font-bold mt-7 sm:flex-row">
                <Button v-if="contact_numbers.length" :disabled="isPending" @click="goBack"
                    class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
                    Go back
                </Button>
                <Button @click="addNew" :disabled="isPending"
                    class="bg-[#F5F5F5] border text-black w-full sm:max-w-[300px] hover:bg-[#E5E5E5]">
                    Add new phone
                </Button>
                <Button @click="saveContact" :disabled="isPending"
                    class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E]">
                    {{ isPending ? 'Saving...' : 'Save' }}
                </Button>
            </footer>
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