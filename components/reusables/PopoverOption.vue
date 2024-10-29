<template>
    <div>
        <div className="w-[850px] h-[90px] bg-white rounded-t-3xl shadow justify-center ">
            <!-- Bloque titulo y boton -->
            <div className="flex flex-col items-star justify-center h-full">
                <div class="flex flex-row items-center justify-between">
                    <div
                        className="flex flex-row justify-start  text-black text-2xl font-semibold ml-[34px] leading-[33.32px]">
                        {{ options[selectedOption - 1].texto }}<button @click="togglePopover" className="ml-[9px]">
                            <ChevronDownSVG />
                        </button>                        
                    </div>
                    
                </div>
            </div>
        </div>
        <!-- Popover desplegable -->
        <Popover ref="popover" className="flex w-[200px] p-0 border-1 m-0 bg-white rounded-xl ">
            
            <ul className="list-none  min-w-min w-full p-0 m-0">
                <template v-for="(item, index) in options" className="m-0">
                    <li v-if="item.id != selectedOption" :key="index"
                        className="cursor-pointer hover:bg-black hover:text-white transition-all duration-200 p-0 m-0 "
                        @click="handleOptionClick(item.id)">
                        <div className="w-full py-0 my-0"> 
                            {{ item.texto }}
                        </div>
                    </li>
                </template>
            </ul>
        </Popover>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Popover from 'primevue/popover';
import ChevronDownSVG from '~/components/svgs/ChevronDownSVG.vue';



const props = defineProps({
    selectedOption: {
        type: Number,
    },
    options: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['optionSelected'])

// Referencias y estado
const popover = ref(null)

// Funciones
const togglePopover = (event) => {
    popover.value.toggle(event)
}

const handleOptionClick = (item_id) => {
    emit('optionSelected', item_id)
}

</script>

<style scoped>



li {
    height: 100%; 
    width: 100%;        
}

li:hover {
    background-color: black;
    color: white;     
}
</style>