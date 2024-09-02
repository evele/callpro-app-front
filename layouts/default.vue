<template>
    <div class="grid-container">
        <div class="item1">Header</div>
        <Navbar class="item2"></Navbar>
        <div class="item3">
            <slot></slot>
        </div>  
        <div class="item5">Footer</div>
    </div>
</template>  
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
  font-size: 30px;
}
</style>
  