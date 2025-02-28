<template>
    <Button 
        type="button" 
        class="p-0 h-10 w-[146px] font-semibold text-black text-sm bg-transparent hover:bg-gray-100 rounded-[14px] border-none"
        :class="{'active-btn': is_active}"
        @click="togglePopover"
    >
        <RefreshSVG class="w-6 h-6 svg-color" />
        Auto recharge
    </Button>
    <Popover ref="popover" class="border-none before:hidden after:hidden rounded-xl max-w-[240px] w-full bg-light-2 shadow-popover overflow-y-auto">
        <div class="text-dark-2 py-3 px-4">
            <div class="flex justify-between items-center">
                <label for="auto-recharge" class="text-sm">Auto recharge</label>
                <ToggleSwitch v-model="enabled" />
            </div>
            <div v-show="enabled" class="flex flex-col gap-4 text-sm mt-4">
                <div class="flex items-center gap-2">
                    <p>Add</p>
                    <InputNumber 
                        v-model="recharge_value" 
                        inputId="integeronly" 
                        fluid
                        placeholder="Credits Amount"
                        class="w-[92px] h-[30px] text-sm border-none" 
                    />
                    <p>when my</p>
                </div>
                <div class="flex items-center gap-2">
                    <p>balance reaches</p>
                    <InputNumber 
                        v-model="recharge_minimum" 
                        inputId="integeronly" 
                        fluid
                        placeholder="Credits Amount"
                        class="w-[92px] h-[30px] border-none" 
                    />
                </div>
            </div>
        </div>
    </Popover>
</template>

<script setup lang="ts">

    const props = defineProps<{
        userBillingSettings: { billing_settings: UserBillingSettingsData } | null
    }>()

    const enabled = ref(false)
    const popover = ref()
    const recharge_value = ref(null)
    const recharge_minimum = ref(null)

    const togglePopover = (event: MouseEvent) => {
        is_active.value = !is_active.value
        popover.value?.toggle(event)
    }
    const is_active = computed(() => popover?.value?.visible)

    watch(() => props.userBillingSettings, (settings: UserBillingSettingsData | null) => {
        if(settings && settings?.recharge_value !== null) {
            enabled.value = true
            recharge_value.value = Number(settings?.recharge_value)
            recharge_minimum.value = settings?.recharge_minimum !== null ? Number(settings?.recharge_minimum) : null
        }
    }, { immediate: true })

    watch(enabled, (value: boolean) => {
        if(!value) {
            recharge_value.value = null
            recharge_minimum.value = null
        }
    })
</script>

<style scoped lang="scss">
.svg-color {
    color: #757575;
    transition: color 0.3s;
}
.active-btn {
    color: white;
    background: #6750A4;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 1px 4px 0px rgba(12, 12, 13, 0.10), 0px 1px 4px 0px rgba(12, 12, 13, 0.05);
    .svg-color {
        color: white;
    }
}

:deep(.p-inputnumber) {
    .p-inputtext {
        font-size: 12px;
        padding: 2px 6px;
        text-align: center;
        border-radius: 9px;
        &::placeholder {
            font-size: 10px;
            color: #B3B3B3
        }
    }
}
</style>