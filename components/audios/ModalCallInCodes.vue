<template>
    <Dialog v-model:visible="visible" :draggable="false" @hide="close" class="max-w-[746px] w-[90vw]">
        <!-- class="w-full max-w-[746px] shadow flex-col justify-center items-center inline-flex"> -->
        <template #header>            
            <h2>Call in Audio<ChevronDownSVG /></h2>
        </template> 
        <div class="flex flex-row gap-4  justify-center items-center ">
            <Button class="bg-white text-black rounded-xl shadow gap-[7px] inline-flex text-sm border-none hover:bg-black hover:text-white">
                Create a Call In Code
            </Button>
            <Button class="bg-black rounded-xl shadow gap-[7px] inline-flex text-sm border-none rounded hover:bg-white hover:text-black">
                Add 1 Time Call In Code
            </Button>            
        </div>

        <div class="w-full flex flex-col items-center  text-sm gap-9">
            
                             
        </div><!-- Tabla completa con encabezado y cuerpo -->
                <table class="w-full  text-gray-700 border border-gray-200">
                    <!-- Encabezado de la tabla -->
                    <thead>
                        <tr class="flex flex-row bg-[#653494] rounded-tl-md rounded-tr-md justify-center items-center gap-5 inline-flex">
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

                    <!-- Cuerpo de la tabla -->
                    <tbody
                        v-if="userCallInCodes && 'user_call_in_codes' in userCallInCodes && userCallInCodes.user_call_in_codes"
                        class="flex flex-col justify-center items-center gap-5 inline-flex">
                        <tr v-for="code in userCallInCodes.user_call_in_codes" :key="code.id"
                            class="border-b border-gray-200">
                            <td class="w-[220px]  text-center py-2">{{ code.call_in_code }}</td>
                            <td class="w-[220px]  text-center py-2">{{ code.date }}</td>
                            <td class="w-[60px] py-2">a;gp</td>
                        </tr>
                    </tbody>
                </table>          
        <!-- Mensajes de carga y error -->
        <p v-if="isLoading" class="text-center my-4 text-gray-500">Loading data...</p>
            <p v-else-if="isError" class="text-center my-4 text-red-500">Error: {{ error?.message }}</p>
            <InfoPanel v-if="!has_uploaded" class="mt-7">
                <p class="font-bold">You have to call to the number <span class="font-normal">(888) 604 2611</span></p>
                <p class="font-bold">and follow the instructions using the code to add your Call in Audio.</p>                
            </InfoPanel> 

        <template #footer>
                <Button @click="saveContact" class="w-[300px] h-10 rounded-[30px] justify-center items-center gap-4 inline-flex">
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