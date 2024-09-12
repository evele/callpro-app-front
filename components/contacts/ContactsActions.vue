<template>
    <section class="container">
        <ContactsActionBtn v-for="option in OPTIONS" :key="option.text" :text="option.text" :count="option.count" :icon="option.icon" :icon-color="option.iconColor"
            :icon-bg="option.iconBG" :bg-gradient="option.bgGradient" :icon-on-hover="option.iconOnHover" :icon-on-hover-color="option.iconOnHoverColor"
        />
    </section>
</template>

<script setup lang="ts">
    import ContactsSVG from "@/components/svgs/ContactsSVG.vue"
    import GroupsSVG from "@/components/svgs/GroupsSVG.vue"
    import DncSVG from "@/components/svgs/DncSVG.vue"
    import UploadSVG from "@/components/svgs/UploadSVG.vue"
    import PlusSVG from "@/components/svgs/PlusSVG.vue"

    const OPTIONS = [
        { text: "Contacts", count: 123, icon: ContactsSVG, iconColor: "#4F378B", iconBG: "#E8DEF8", bgGradient: "bg-contacts", iconOnHover: PlusSVG },
        { text: "Groups", count: 23, icon: GroupsSVG, iconColor: "#009951", iconBG: "#CFF7D3", bgGradient: "bg-groups", iconOnHover: PlusSVG },
        { text: "DNC", count: 12, icon: DncSVG, iconColor: "#E5A000", iconBG: "#FFF1C2", bgGradient: "bg-dnc", iconOnHover: PlusSVG },
        { text: "Upload a new file", icon: UploadSVG, iconColor: "#1D1B20", iconBG: "#E8DEF8", iconOnHoverColor: "#1D1B20" },
    ]
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 250px; /* TODO: review this, and height do not allow extra items */ 
        height: 250px;
        border-radius: 16px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        position: relative;
        background-color: #CAC4D0;
        gap: 1px;
    }
    
</style>