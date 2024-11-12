<template>
    <div class="info pl-2.5 py-3.5 bg-[#dbd7e7] rounded-tl-[10px] rounded-tr-[10px] border-b-[1.5px] border-[#9747ff]">
        <slot></slot>
    </div>
</template>
<style scoped>
     .info {
        width: 100%;
        font-size: 14px;
        line-height: 140%;
        
    }
    .info ul {
        padding-left: 20px;
    }
</style>