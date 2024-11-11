<template>
    <Dialog v-model:visible="visible" modal :closable="false" class="w-full max-w-[850px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-6">
                <PopoverOption :options="menuOptions" :selected-option="option" @optionSelected="handleOptionSelected" />
                <Button @click="close" class="bg-transparent border-none  px-2 text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[78px]" />
        </template>

        <slot />
    </Dialog>
</template>

<script setup lang="ts">
    const visible = ref(false);

    const menuOptions = ref([
        { id:1, texto: "Add new contact", accion: () => alert("Acción 1 ejecutada") },
        { id:2, texto: "Add new Group", accion: () => alert("Acción 2 ejecutada") },
        { id:3, texto: "Add new DNC", accion: () => alert("Acción 3 ejecutada") },
        { id:4, texto: "Upload file", accion: () => alert("Acción 3 ejecutada") }
    ]);

    const option = ref(1)

    const handleOptionSelected = (selectedOption: number) => {
        console.log("Opción seleccionada:", selectedOption);
        option.value = selectedOption
    };

     const open = () => {
        visible.value = true;
    }

    const close = () => {
        visible.value = false;
    }

    defineExpose({ open });
</script>