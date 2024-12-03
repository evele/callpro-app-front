<template>
    <div class="grid-container">
        <div class="item1 sticky top-0 left-0 z-[1000]">
            Header
            <span v-if="show_current_env() !== ''" class="env-title">{{ show_current_env() }}</span>
        </div>
        <Navbar class="item2"></Navbar>
        <main class="item3">
            <slot></slot>
        </main>  
    </div>
</template>

<script setup lang="ts">
    const show_current_env = () => {
        const runtimeConfig = useRuntimeConfig()
        let env = '';

        switch (runtimeConfig.public.ENVIRONMENT) {
            case 'development':
                env = 'Development'
                break
            case 'test':
                env = 'Test'
                break
        }
        return env
    }
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

    .env-title {
        color: white;
        background-color: #f00;
        font-weight: bold;
        padding: 2px 10px;
        letter-spacing: .8px;
    }

    .item1 {
        height:6.5rem;
        padding: 10px 0;
        border-bottom: 2px solid #DED8E1;
        margin-left: 250px
    }

    .item3 {
        background-color: var(--p-purple-100);
        margin-left: 250px
    }

</style>
  