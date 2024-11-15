<template>
    <Button class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-black hover:bg-gray-100 hover:shadow-lg border-none" @click="togglePopover">
        <FilterSVG class="text-[#757575]" />
        <span class="font-semibold">Filter</span>
    </Button>
    <Popover ref="popover" class="border-none before:hidden after:hidden rounded-xl max-w-[230px] max-h-72 w-full bg-[#FEF7FF] shadow-popover overflow-y-auto">
        <div class="text-[#1D1B20] py-3 px-4">

            <span class="block mb-3 text-[#1D1B20]">Filters</span>
            <ul class="list-none p-0 m-0 flex flex-col gap-4">
                <div class="flex items-center pl-2 gap-4 hover:cursor-pointer" @click.prevent="handleSelectAll()">
                    <Checkbox v-model="all" :binary="true" :value="all" />
                    <span class="text-sm">{{ allContacts.name }}</span>
                    <span class="text-xs text-[#49454F] font-medium ml-auto">{{ allContacts.count }}</span>
                </div>
                <div v-for="filter in filtersSystem" :key="filter.id" class="flex items-center pl-2 gap-4 hover:cursor-pointer" @click.prevent="handleSelect(filter.id)">
                    <Checkbox v-model="selected_filters" :inputId="filter.id" :value="filter.id" />
                    <span class="text-sm">{{ filter.name }}</span>
                    <span class="text-xs text-[#49454F] font-medium ml-auto">{{ filter.count }}</span>
                </div>
            </ul>

            <span class="block mt-4 mb-3 text-[#1D1B20]" v-if="filtersCustom.length">My groups</span>
            <ul class="list-none p-0 m-0 flex flex-col gap-4">
                <div v-for="filter in filtersCustom" :key="filter.id" class="flex items-center pl-2 gap-4 hover:cursor-pointer" @click.prevent="handleSelect(filter.id)">
                    <Checkbox v-model="selected_filters" :inputId="filter.id" :value="filter.id" />
                    <span class="text-sm">{{ filter.name }}</span>
                    <span class="text-xs text-[#49454F] font-medium ml-auto">{{ filter.count }}</span>
                </div>
            </ul>
        </div>
    </Popover>
</template>

<script setup lang="ts">
    const props = defineProps({
        allContacts: { type: Object, required: true }, //TODO: Fix ts errors
        filtersSystem: { type: Array as PropType<FilterOption[]>, required: true, default: [] },
        filtersCustom: { type: Array as PropType<FilterOption[]>, required: false, default: [] }
    })

    const popover = ref()
    const emit = defineEmits(['update:filters'])

    const togglePopover = (event: MouseEvent) => {
        popover.value?.toggle(event)
    }

    const all = ref(false)
    const selected_filters = ref<string[]>([])

    const all_filters = computed<FilterOption[]>(() => {
        return props.filtersSystem.concat(props.filtersCustom)
    })

    const handleSelectAll = () => {
        all.value = !all.value
        if (selected_filters.value.length === all_filters.value.length) {
            selected_filters.value = []
        } else {
            selected_filters.value = all_filters.value.map((filter: FilterOption) => filter.id)
        }
        emit('update:filters', selected_filters.value)
    }

    const handleSelect = (id: string) => {
        const index = selected_filters.value.indexOf(id)
        if (index === -1) {
            selected_filters.value.push(id)
        } else {
            selected_filters.value.splice(index, 1)
        }
        console.log(selected_filters.value)
        all.value = selected_filters.value.length === all_filters.value.length
        emit('update:filters', selected_filters.value)
    }
</script>

<style scoped lang="scss">
:deep(.p-checkbox) {
    width: 14px;
    height: 14px;
    border: none;
    .p-checkbox-input, .p-checkbox-box {
        width: 14px;
        height: 14px;
        border: 1.8px solid #49454F;
        border-radius: 1.5px;;
    }
}
</style>