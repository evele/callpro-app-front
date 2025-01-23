<template>
    <div class="grid-container">
        <MainHeader class="item1" />
        <Navbar class="item2"></Navbar>
        <main class="item3">
            <slot></slot>
        </main>  
    </div>
</template>

<script setup lang="ts">
   
</script>

<style scoped>
    .item1 { 
        grid-area: header; 
        height:6.5rem;
        border-bottom: 2px solid #DED8E1;
        position: sticky;
        top: 0;
        z-index: 1000;
    }
    .item2 { grid-area: menu; }
    .item3 { 
        grid-area: main; 
        background-color: var(--p-purple-100);
    }

    .grid-container {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr;
        grid-template-areas:
            'menu header'
            'menu main';
        height: 100vh;
    }

    .grid-container > div {
        background-color: rgba(255, 255, 255, 0.99);
    }

    /*
    .grid-container > .item2 {
        overflow-y: auto; 
    }

    .grid-container > .item3 {
        height: calc(100vh - 6.5rem); 
    }*/

</style>
  