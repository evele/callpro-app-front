<template>
    <div class="grid-container">
        <MainHeader class="item1  sticky top-0 left-0 z-[1000]" />
        <Navbar class="item2"></Navbar>
        <main class="item3">
            <slot></slot>
        </main>  
    </div>
</template>

<script setup lang="ts">
   
</script>

<style scoped>
    .item1 { grid-area: header; }
    .item2 { grid-area: menu; }
    .item3 { grid-area: main; }

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

    .item1 {
        height:6.5rem;
        border-bottom: 2px solid #DED8E1;
        margin-left: 250px
    }

    .item3 {
        background-color: var(--p-purple-100);
        margin-left: 250px
    }

</style>
  