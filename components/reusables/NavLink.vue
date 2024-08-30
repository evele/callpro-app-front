<template>
    <li class="nav-link" :class="is_active(route)">
        <NuxtLink :to="route" :class="is_active(route)">
            <component :is="icon" />
            <span>{{ name }}</span>
        </NuxtLink>
    </li>
</template>

<script setup lang="ts">
    const props = defineProps({
        route: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: Object, required: true },
    });

    const router = useRouter();
    const currentRoute = router.currentRoute;
    const is_active = (route: string) => currentRoute.value.name == route ? "nav-link--active" : ""; 
</script>