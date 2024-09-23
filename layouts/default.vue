<template>
    <div class="grid-container">
        <div class="item1">
            Header
            <span v-if="show_current_env() !== ''" class="env-title">{{ show_current_env() }}</span>
        </div>
        <Navbar class="item2"></Navbar>
        <div class="item3">
            <slot></slot>
        </div>  
        <div class="item5">Footer</div>
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
            case 'production':
                break
            default:
                env = ''
            break
        }
        return env
    }
</script>

<style scoped>
    .item1 { grid-area: header; }
    .item2 { grid-area: menu; }
    .item3 { grid-area: main; }
    .item4 { grid-area: right; }
    .item5 { grid-area: footer; }

.grid-container {
    display: grid;
    grid-template-areas:
    'menu header header header header header'
    'menu main main main main main'
    'menu footer footer footer footer footer';
    gap: 10px;
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
    padding: 10px 0;
}
</style>
  