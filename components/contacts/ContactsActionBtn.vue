<template>
    <div class="option" @mouseover="is_hovering = true" @mouseleave="is_hovering = false">
        <Button class="button" @click="handle_btn_action(text)" :class="[ { visible: is_hovering }, bgGradient ]">
            <component :is="iconOnHover !== null ? iconOnHover : icon" :style="{ color: iconOnHoverColor}"/>
        </Button>

        <div class="option-container" :class="{ hidden: is_hovering }">
            <div class="option-icon" :style="{ color: props.iconColor, backgroundColor: props.iconBg }">
                <component :is="icon"/>
            </div>
            <span :class="[ count ? 'option-title' : 'option-only-title' ]">{{ text }}</span>
            <span class="option-amount" v-if="count" :style="{ color: props.iconColor }">{{ count }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        text: { type: String, required: true },
        count: { type: Number, required: false, default: null },
        icon: { type: Object, required: true },
        iconColor: { type: String, required: true },
        iconBg: { type: String, required: true },
        bgGradient: { type: String, required: false, default: '' },
        iconOnHover: { type: Object, required: false, default: null },
        iconOnHoverColor: { type: String, required: false, default: '' },
    });

    const is_hovering = ref(false);

    const emit = defineEmits(['click']);

    const handle_btn_action = (text: string) => {
        // Dejo creado el switch para agregar luego el resto de las acciones
        switch (text) {
            case 'DNC':
                emit('click', 'dnc');
                break;
            default:
                break;
        }
    }
</script>

<style scoped>
    .option {
        width: 125px;
        height: 125px;
        border: none;
        padding: 16px 28px 16px 28px;
        background-color: #FFFFFF;
        position: relative;
    }

    .button {
        box-shadow: 0px 3.556px 3.556px 0px rgba(0, 0, 0, 0.25);
        width: 48px;
        height: 48px;
        border-radius: 100%;
        border: none;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.7);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .button.visible {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    .button:hover {
        cursor: pointer;
        opacity: 0.8;
    }

    .bg-contacts {
        background: linear-gradient(180deg, #4F378B 0%, #532CB5 100%);
    }
    .bg-groups {
        background: linear-gradient(180deg, #009951 0%, #00E378 100%);
    }
    .bg-dnc {
        background: linear-gradient(180deg, #E5A000 0%, #B88000 100%);
    }

    .option-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%; 
        gap: 6px;
        transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
        opacity: 1;
        visibility: visible;
    }

    .option-container.hidden {
        opacity: 0;
        visibility: hidden;
        transform: scale(0.9);
    }

    .option-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        width: 36px;
        height: 36px;
    }

    .option-title {
        color: #79747E;
        font-size: 16px;
        line-height: 22.4px;
    }

    .option-only-title {
        color: #79747E;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0.1px;
    }

    .option-amount {
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: -0.4px;
    }
</style>