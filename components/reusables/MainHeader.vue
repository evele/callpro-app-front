<template>
    <div class="flex items-center pl-[50px] pr-[25px] justify-between">
        <div class="flex items-center gap-6">
            <p class="text-[#79747E] text-sm">{{ current_route_name }} {{ currentSection ? '/' : '' }}
                <span v-if="currentSection" class="text-black font-medium"> {{ currentSection }}</span>
            </p>
            <Select v-model="option_selected" :options="select_options" optionLabel="name" class="w-44 h-9 text-sm shadow-md" />
        </div>
        
        <span v-if="show_current_env() !== ''" class="text-white bg-[#F00] font-bold py-[2px] px-[10px] tracking-wide">{{ show_current_env() }}</span>

        <div class="flex gap-3 items-center">
            <Button class="bg-[#E1FF8D] w-28 h-11 text-[#1D192B] font-medium text-sm px-0 border-none hover:bg-[#cafa44] hover:scale-105 transition-all">
                <CoinsSVG class="w-5 h-5" />
                0 Credits
            </Button>
            <Button class="bg-[#89A43D] w-28 h-11 text-white font-medium text-sm px-0 border-none hover:bg-[#5b7909] hover:scale-105 transition-all">
                <ShoppingCartSVG class="w-[18px] h-[18px]" />
                <span>Get a plan</span>
            </Button>

            <button @click="togglePopover" class="flex items-center gap-1 hover:bg-gray-100 rounded-lg">
                <Avatar :image="AvatarImage" class="shadow-lg" size="large" shape="circle" />
                <ChevronDownSVG class="h-4 w-4" />
            </button>
            <Popover ref="popover" class="border-none before:hidden after:hidden rounded-xl mt-2">
                <ul class="list-none p-0">
                    <li v-for="option in popover_options" :key="option.id"
                        class="cursor-pointer px-4 first:rounded-t-xl last:rounded-b-xl hover:bg-black hover:text-white transition-all duration-200 
                            flex items-center gap-2 text-sm py-2"
                        @click="handle_select_option(option.id)"
                        @mouseover="hover_index = option.id" @mouseleave="hover_index = null"
                    >
                        <Chip class="w-[22px] h-[22px] p-[3px]" :class="[ hover_index === option.id ? 'bg-white' : 'bg-[#E8DEF8]']">
                            <component :is="option.icon" class="h-4 w-4" />
                        </Chip>
                        <span>{{ option.text }}</span> 
                    </li>
                </ul>
            </Popover>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CoinsSVG from '../svgs/CoinsSVG.vue';
    import ShoppingCartSVG from '../svgs/ShoppingCartSVG.vue';
    import ChevronDownSVG from '../svgs/ChevronDownSVG.vue';
    import ContactsSVG from '../svgs/ContactsSVG.vue';
    import PhoneSVG from '../svgs/PhoneSVG.vue';
    import LogoutSVG from '../svgs/LogoutSVG.vue';
    import AvatarImage from '@/assets/png/Shape.png';
    import { useAuthStore } from "@/stores"

    const props = defineProps({
        currentSection: { type: String, required: false, default: '' }
    })

    const authStore = useAuthStore()
    const router = useRouter()
    const current_route_name = ref('')

    const set_route_name = () => {
        const current_route = router.currentRoute.value
        if(current_route?.name) {
            current_route_name.value = typeof current_route?.name === 'symbol'
                                       ? String(current_route.name)
                                       : current_route.name?.charAt(0).toUpperCase() + current_route.name?.slice(1) || '';
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

    const option_selected = ref({ name: '(845) 378-1500', code: '1' })
    const select_options = ref([
        { name: '(845) 378-1500', code: '1' },
        { name: '(845) 378-1501', code: '2' },
        { name: '(845) 378-1502', code: '3' },
        { name: '(845) 378-1503', code: '4' },
    ])

    /* ----- popover ----- */
    const popover = ref()
    const hover_index = ref<number | null>(null)

    const togglePopover = (event: any) => {
        popover?.value?.toggle(event)
    }

    const handle_select_option = (option_id: number) => {
        popover?.value?.toggle(false)
        if(option_id === 3) {
            authStore.logout();
        }
    }

    const popover_options = [
        { id: 1, text: "My account", icon: ContactsSVG },
        { id: 2, text: "My CP Number", icon: PhoneSVG },
        { id: 3, text: "Log out", icon: LogoutSVG },
    ];
</script>

<style scoped lang="scss">
    :deep(.p-avatar) {
        width: 43px;
        height: 43px;
    }
</style>