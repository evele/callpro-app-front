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
    { id:1, texto: "Texto 1", accion: () => alert("Acción 1 ejecutada") },
    { id:2, texto: "Texto 2", accion: () => alert("Acción 2 ejecutada") },
    { id:3, texto: "Texto 3", accion: () => alert("Acción 3 ejecutada") }
]);
const opcion = ref(1)

const handleOptionSelected = (selectedOption) => {
    console.log("Opción seleccionada:", selectedOption);
    opcion.value = selectedOption
};

</script>