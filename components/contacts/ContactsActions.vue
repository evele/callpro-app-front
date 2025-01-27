<template>
    <section class="flex flex-col gap-2 w-full min-w-[220px] rounded-2xl bg-white p-[14px] shadow-lg">
        <ContactsActionBtn v-for="option in OPTIONS" :key="option.id" :text="option.text"
            :count="option.count" :icon="option.icon" :icon-color="option.iconColor" @click="emit('click', option.id);"
        />
    </section>
</template>

<script setup lang="ts">
    import ContactsSVG from "@/components/svgs/ContactsSVG.vue"
    import GroupsSVG from "@/components/svgs/GroupsSVG.vue"
    import DncSVG from "@/components/svgs/DncSVG.vue"

    const props = defineProps({
        totalContactsNumber: { type: [Number, null], required: true },
        totalGroupsNumber: { type: [Number, null], required: true },
        totalDncNumber: { type: [Number, null], required: true },
    })

    const OPTIONS = computed(() => [
        { id: 'contact', text: "Total Contacts", count: props.totalContactsNumber, icon: ContactsSVG, iconColor: "#4F378B" },
        { id: 'new_group', text: "Total Groups", count: props.totalGroupsNumber, icon: GroupsSVG, iconColor: "#009951" },
        { id: 'dnc', text: "Total DNC", count: props.totalDncNumber, icon: DncSVG, iconColor: "#E5A000" },
    ])

    const emit = defineEmits(['click']);
</script>