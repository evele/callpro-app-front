<template>
    <section class="flex flex-col gap-2 w-[250px] rounded-2xl bg-white p-[14px] shadow-lg">
        <ContactsActionBtn v-for="option in OPTIONS" :key="option.text" :text="option.text"
            :count="option.count" :icon="option.icon" :icon-color="option.iconColor" @btnAction="handle_btn_action"
        />
    </section>
</template>

<script setup lang="ts">
    import ContactsSVG from "@/components/svgs/ContactsSVG.vue"
    import GroupsSVG from "@/components/svgs/GroupsSVG.vue"
    import DncSVG from "@/components/svgs/DncSVG.vue"

    const props = defineProps({
        dncTotalNumbers: { type: [Number, null], required: true },
    })

    const OPTIONS = computed(() => [
        { text: "Total Contacts", count: 123, icon: ContactsSVG, iconColor: "#4F378B" },
        { text: "Total Groups", count: 23, icon: GroupsSVG, iconColor: "#009951" },
        { text: "Total DNC", count: props.dncTotalNumbers, icon: DncSVG, iconColor: "#E5A000" },
    ])

    const emit = defineEmits(['click']);
    const handle_btn_action = (text: string) => {
        emit('click', text);
    }
</script>