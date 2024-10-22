<template>
   <Dialog v-model:visible="visible" modal :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-5">
                <h2 class="flex items-center gap-4 font-bold text-lg text-black">Add new contact <ChevronDownSVG /></h2>
                <Button @click="close" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>
        
        <section>Aca va la tabla</section>

        <template #footer>
            <footer class="w-full flex justify-center font-bold mt-7">
                <Button @click="console.log(dnc_contacts_data)" class="bg-[#653494] border-white text-white w-full sm:max-w-[300px] hover:bg-[#4A1D6E]">
                    Ready
                </Button>
            </footer>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    const page = ref(1)
    const show = ref(10)
    const search = ref('')

    const { data: dnc_contacts, isLoading: dnc_is_loading, isSuccess: dnc_is_success, refetch: dnc_refetch } = useFetchDNCContacts(page,show,search)

    const dnc_contacts_data = computed(() => {
        console.log('modal')
        if(!dnc_contacts?.value?.result) return { dnc_contacts: [], dnc_total_contacts: 0 }
        return dnc_contacts?.value
    })

    const visible = ref(false);

    const open = () => {
        visible.value = true;
    }

    const close = () => {
        visible.value = false;
    }

    defineExpose({ open });
</script>

<style scoped>

</style>