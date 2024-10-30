<template>
    <div>
        
        <PopoverOption         
        :options="menuOptions"
        :selected-option=opcion
         @optionSelected="handleOptionSelected"    
        
        />

    </div>
  
    
</template>

<script setup>

import PopoverOption from '~/components/reusables/PopoverOption.vue';

const menuOptions = ref([
    { id:1, texto: "Add new contact", accion: () => alert("Acción 1 ejecutada") },
    { id:2, texto: "Add new Group", accion: () => alert("Acción 2 ejecutada") },
    { id:3, texto: "Add new DNC", accion: () => alert("Acción 3 ejecutada") },
    { id:4, texto: "Upload file", accion: () => alert("Acción 3 ejecutada") }
]);
const opcion = ref(1)

const handleOptionSelected = (selectedOption) => {
    console.log("Opción seleccionada:", selectedOption);
    opcion.value = selectedOption
};

</script>