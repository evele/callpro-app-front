<template>
    <section class="container">
        <ContactsActionBtn v-for="option in OPTIONS" :key="option.text" :text="option.text" :count="option.count" 
            :icon="option.icon" :iconColor="option.iconColor" :iconBG="option.iconBG"
        />
    </section>
</template>

<script setup lang="ts">
    import ContactsSVG from "@/components/svgs/ContactsSVG.vue"
    import GroupsSVG from "@/components/svgs/GroupsSVG.vue"
    import DncSVG from "@/components/svgs/DncSVG.vue"
    import UploadSVG from "@/components/svgs/UploadSVG.vue"


    const OPTIONS = [
        { text: "Contacts", count: 123, icon: ContactsSVG, iconColor: "#4F378B", iconBG: "#E8DEF8" },
        { text: "Groups", count: 23, icon: GroupsSVG, iconColor: "#009951", iconBG: "#CFF7D3" },
        { text: "DNC", count: 12, icon: DncSVG, iconColor: "#E5A000", iconBG: "#FFF1C2" },
        { text: "Upload a new file", icon: UploadSVG, iconColor: "#1D1B20", iconBG: "#E8DEF8" }
    ]
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 250px;
        height: 250px;
        border-radius: 16px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        position: relative;
    }
    
    .container::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px; 
        background-color: #CAC4D0;
        transform: translateX(-50%);
    }

    .container::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px; 
        background-color: #CAC4D0; 
        transform: translateY(-50%);
    }
</style>