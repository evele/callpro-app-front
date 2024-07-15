<template>
    <div>
        <p class="text-title">Audios page</p>
        <button type="button" @click="load_numbers">Load audios</button>
        <div class="container-div">
            <p>Show older audios</p>
            <input type="checkbox" v-model="show_older">
        </div>
    </div>
</template>

<script setup>
    import { useAudiosStore } from "@/stores"

    const audiosStore = useAudiosStore()
    const show_older = ref(false)

    onMounted(async() => {
        await audiosStore.loadAudios()
    })
    
    const load_numbers = () => {
        audiosStore.loadAudios(show_older.value)   
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .container-div {
        display: flex;
        align-items: center;
        font-size: 18px;
    }
</style>