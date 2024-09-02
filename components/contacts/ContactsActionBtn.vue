<template>
    <button @click="do_action" class="button">
        <div class="button__icon">
            <ContactsSVG/>
        </div>
        <span class="button__title">Contacts</span>
        <span class="button__amount">123</span>
    </button>
</template>

<script setup lang="ts">
    const do_action = () => {
        console.log('nothing to do');
    }
</script>

<style scoped>
    .button {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 125px;
        height: 125px;
        border: none;
        padding: 16px 27px 15px 28px;
        background-color: #FFFFFF;
        flex-shrink: 0;
        transition: background-color 0.3s;  
    }

    .button:hover {
        cursor: pointer;
        background-color: #dcdbdb;
    }

    .button__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        background-color: #E8DEF8;
        color: #4F378B;
        width: 36px;
        height: 36px;
    }

    .button__title {
        color: #79747E;
        text-align: center;
        font-size: 16px;
        line-height: 22.4px;
    }

    .button__amount {
        color: #4F378B;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: -0.4px;
    }
</style>