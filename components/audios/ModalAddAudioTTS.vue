<template>
    <!-- TODO: text 2xl 3xl dont' function -->
    <Dialog v-model:visible="visible" modal header="Add Audio from TTS" class="text-2xl w-full max-w-[850px]">
        <Divider class="max-w-[850px]" />

        <!-- Agrupamos en un contenedor con flex y gap-->
        <div class="flex flex-col gap-[38px] mt-9">

            <div className="w-[738px] h-[33px] text-[#1e1e1e] text-sm font-normal font-['Inter'] leading-snug">Type the
                message here to have it converted to audio.</div>

        </div>
        <div class="modal">
            <button @click="$emit('close')">Cerrar</button>
            <!-- Contenido del modal -->
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import ChevronDownSVG from '../svgs/ChevronDownSVG.vue';

const visible = ref(false);

const open = () => {
    visible.value = true;
}

const close = () => {
    visible.value = false;
}

</script>
<style scoped></style>
