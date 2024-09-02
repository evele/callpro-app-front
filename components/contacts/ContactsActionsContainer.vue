<template>
    <section class="container">
        <ContactsActionBtn />
        <ContactsActionBtn />
        <ContactsActionBtn />
        <ContactsActionBtn />
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 250px;
        height: 250px;
        border-radius: 16px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
</style>