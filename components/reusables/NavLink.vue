<template>
    <li>
        <NuxtLink class="nav-link" :to="route" :class="is_active(route)" @click="name === 'Logout' ? logout() : null">
            <component :is="icon" />
            <span>{{ name }}</span>
        </NuxtLink>
    </li>
</template>

<script setup lang="ts">
    import { useAuthStore } from "@/stores"

    const props = defineProps({
        route: { type: String, required: false, default: null },
        name: { type: String, required: true },
        icon: { type: Object, required: true },
    });

    const router = useRouter();
    const currentRoute = router.currentRoute;
    const is_active = (route: string) => currentRoute.value.name == route ? "nav-link--active shadow-lg" : "";
    
    const authStore = useAuthStore()
    const logout = () => {
        authStore.logout();
    }
</script>

<style scoped>
    li {
        list-style-type: none;
    }

    .nav-link {
        color: inherit;
        padding: 0.75rem;
        text-decoration: none;
        border-radius: 1.25rem;
        width: 172px;
        height: 45px;
        display: flex;
        align-items: center;
        padding-left: 2rem;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.5rem;
    }
    .nav-link:hover {
        background-color: #EEEEEE;
        cursor: pointer;
    }

    .nav-link--active {
        background-color: #653494;
        color: #ffffff;
    }

    .nav-link--active:hover {
        background-color: #8244bc;
    }

    .nav-link span {
        width: 100%;
        text-align: center;
    }
</style>