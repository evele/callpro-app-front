<template>
    <nav class="flex items-center pl-[50px] justify-between">
        <p class="text-[#79747E] text-sm">{{ current_route_name }} {{ currentSection ? '/' : '' }}
            <span v-if="currentSection" class="text-black font-medium"> {{ currentSection }}</span>
        </p>
        <span v-if="show_current_env() !== ''" class="text-white bg-[#F00] font-bold py-[2px] px-[10px] tracking-wide">{{ show_current_env() }}</span>
    </nav>
</template>

<script setup lang="ts">
    const props = defineProps({
        currentSection: { type: String, required: false, default: '' }
    })

    const router = useRouter()
    const current_route_name = ref('')

    const set_route_name = () => {
        const current_route = router.currentRoute.value
        if(current_route?.name) {
            current_route_name.value = current_route.name.charAt(0).toUpperCase() + current_route.name.slice(1)
        }
    }

    onMounted(() => set_route_name())
    watch(router.currentRoute, () => set_route_name())

    const show_current_env = () => {
        const runtimeConfig = useRuntimeConfig()
        let env = '';

        switch (runtimeConfig.public.ENVIRONMENT) {
            case 'development':
                env = 'Development'
                break
            case 'test':
                env = 'Test'
                break
        }
        return env
    }
</script>