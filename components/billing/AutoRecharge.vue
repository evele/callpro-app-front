<template>
    <Button 
        id="btn-auto-recharge"
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
                        :invalid="invalid_recharge_value"
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
                        :invalid="invalid_recharge_minimum"
                    />
                </div>
            </div>
            <div class="flex">
                <Button 
                    class="mt-6 w-full rounded-xl max-w-[150px] text-sm h-[30px] mx-auto flex items-center" 
                    color="primary" 
                    :disabled="disable_save || isSaving" 
                    @click="handle_save_billing_settings"
                >
                    <div class="flex items-center gap-2"v-if="isSaving">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-3 w-3 light-spinner" animationDuration=".5s" aria-label="Saving" />
                        Saving...
                    </div>
                    <span v-else>Save</span>
                </Button>
            </div>
        </div>
    </Popover>
</template>

<script setup lang="ts">
    const { mutate: saveBillingSettings, isPending: isSaving } = useSaveBillingSettings()

    const props = defineProps<{
        userBillingSettings: UserBillingSettingsData | null
        packagesSteps: PackageStep[]
    }>()

    const enabled = ref(false)
    const popover = ref()
    const recharge_value = ref<NumberOrNull>(null)
    const recharge_minimum = ref<NumberOrNull>(null)
    const disable_save = ref(true)

    const togglePopover = (event: MouseEvent) => {
        popover.value?.toggle(event)
    }
    const is_active = computed(() => popover?.value?.visible)

    const invalid_recharge_value = ref(false)
    const invalid_recharge_minimum = ref(false)

    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const lower_step_floor = computed(() => {
        if(!props.packagesSteps?.length) return null
        return props.packagesSteps.reduce((lowest: PackageStep, step: PackageStep) => {
            return Number(step.floor) < Number(lowest.floor) ? step : lowest;
        }, props.packagesSteps[0]);
    })

    watch(() => props.userBillingSettings, (settings: UserBillingSettingsData | null) => {
        if(settings && settings?.recharge_value !== null) {
            enabled.value = true
            disable_save.value = false
            recharge_value.value = Number(settings?.recharge_value)
            recharge_minimum.value = settings?.recharge_minimum !== null ? Number(settings?.recharge_minimum) : null
        }
    }, { immediate: true })

    watch(enabled, (value: boolean) => {
        disable_save.value = false
        if(!value) {
            recharge_value.value = null
            recharge_minimum.value = null
        }
    })

    const validate_inputs = () => {
        let valid = true
        if(!enabled.value) return valid

        if(recharge_value.value === null || lower_step_floor.value?.floor && recharge_value.value < lower_step_floor.value?.floor) {
            invalid_recharge_value.value = true
            valid = false
        } else {
            invalid_recharge_value.value = false
        }
        if(recharge_minimum.value === null || recharge_minimum.value <= 0) {
            invalid_recharge_minimum.value = true
            valid = false
        } else {
            invalid_recharge_minimum.value = false
        }
        return valid
    }

    const handle_save_billing_settings = async () => {
        if(!validate_inputs()) {
            show_error_toast('Error', 'You have some invalid data')
            return
        }
        
        const data_to_send: SaveBillingSettingsData = {
            enabled: enabled.value,
            recharge_value: recharge_value.value,
            recharge_minimum: recharge_minimum.value
        }

        saveBillingSettings(data_to_send, {
            onSuccess: (data: APIResponseSuccess | APIResponseError) => {
                if(data.result) {
                    show_success_toast('Success', 'Data saved successfully')
                    document.getElementById('btn-auto-recharge')?.click()
                } else {
                    show_error_toast('Error', data.error || 'An error occurred while saving auto recharge data')
                }
            },
            onError: () => {
                show_error_toast('Error', 'An error occurred while saving auto recharge data')
            }
        })
    }
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

:deep(.light-spinner) {
    .p-progressspinner-circle {
        stroke: white!important;
    }
}
</style>