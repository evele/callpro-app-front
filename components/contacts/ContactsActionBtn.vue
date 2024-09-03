<template>
    <button class="button">
        <div class="button__icon" :style="{ color: props.iconColor, backgroundColor: props.iconBG }">
            <component :is="icon"/>
        </div>
        <span :class="[ count ? 'button__title' : 'button__only-title' ]">{{ text }}</span>
        <span class="button__amount" v-if="count" :style="{ color: props.iconColor }">{{ count }}</span>
    </button>
</template>

<script setup lang="ts">
    const props = defineProps({
        text: { type: String, required: true },
        count: { type: Number, required: false, default: null },
        icon: { type: Object, required: true },
        iconColor: { type: String, required: true },
        iconBG: { type: String, required: true },
    });
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
        background-color: #e8e7e7;
    }

    .button__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        width: 36px;
        height: 36px;
    }

    .button__title {
        color: #79747E;
        text-align: center;
        font-size: 16px;
        line-height: 22.4px;
    }

    .button__only-title {
        color: #79747E;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0.1px;
    }

    .button__amount {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: -0.4px;
    }
</style>