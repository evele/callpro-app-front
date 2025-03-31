<template>
    <li>
        <NuxtLink 
            class="nav-link transition-all duration-300 ease-in-out" 
            :to="safeRoute" 
            :class="[is_active, is_collapsed]" 
            @click="name === 'Logout' ? logout() : null"
        >
            <component :is="icon" />
            <Transition>
                <span v-if="!props.isCollapsed">{{ name }}</span>
            </Transition>
        </NuxtLink>
    </li>
</template>

<script setup lang="ts">
    import { useAuthStore } from "@/stores"

    const props = withDefaults(defineProps<{
        route?: StringOrNull
        name: string
        icon: object
        isCollapsed?: boolean
    }>(), {
        route: null,
        isCollapsed: false
    })

    const router = useRouter();
    const currentRoute = router.currentRoute;
    const safeRoute = computed(() => props.route ?? "#");

    const is_active = computed(() => currentRoute.value.name == props.route ? "nav-link--active shadow-lg" : "")
    const is_collapsed = computed(() => props.isCollapsed ? "flex justify-center w-20" : "w-[172px] pl-8")
    
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
        height: 45px;
        display: flex;
        align-items: center;
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

    .v-enter-active {
        transition: opacity 0.5s linear;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>