<template>
    <button class="button">
        <div class="button-icon" :style="{ color: props.iconColor, backgroundColor: props.iconBG }">
            <component :is="icon"/>
        </div>
        <span :class="[ count ? 'button-title' : 'button-only-title' ]">{{ text }}</span>
        <span class="button-amount" v-if="count" :style="{ color: props.iconColor }">{{ count }}</span>
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
        align-items: center;
        width: 125px;
        height: 125px;
        border: none;
        padding: 16px 28px 16px 28px;
        background-color: #FFFFFF;
        transition: background-color 0.3s;  
        gap: 6px;
    }

    .button:hover {
        cursor: pointer;
        background-color: #e8e7e7;
    }

    .button-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        width: 36px;
        height: 36px;
    }

    .button-title {
        color: #79747E;
        font-size: 16px;
        line-height: 22.4px;
    }

    .button-only-title {
        color: #79747E;
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0.1px;
    }

    .button-amount {
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: -0.4px;
    }
</style>