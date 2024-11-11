<template>
    <div class="flex flex-row justify-start  text-black text-2xl font-semibold">
        {{ options.find(option => option.id === selectedOption)?.text }}
        <button @click="togglePopover" class=" rounded-full px-2 h-8 hover:bg-gray-100"><ChevronDownSVG class="h-4 w-4" /></button>                        
    </div>  
    <Popover ref="popover" class="border-none before:hidden after:hidden rounded-xl m-0">
        <ul class="list-none p-0">
            <template v-for="item in options">
                <li v-if="item.id != selectedOption" :key="item.id"
                    class="cursor-pointer px-4 first:rounded-t-xl last:rounded-b-xl hover:bg-black hover:text-white transition-all duration-200"
                    @click="handleOptionClick(item.id)">
                    <div class="text-center leading-[30px]"> 
                        {{ item.text }}
                    </div>
                </li>
            </template>
        </ul>
    </Popover>
</template>

<script setup>
import ChevronDownSVG from '~/components/svgs/ChevronDownSVG.vue';

const props = defineProps({
    selectedOption: {
        type: String,
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
    popover.value.toggle(false)
}

</script>