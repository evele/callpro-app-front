<template>
    <aside class="flex flex-col justify-center gap-4">
        <PlanCardSummary v-show="selected_type === 'credit'">
            <template #content>
                <div class="flex gap-6 w-full justify-center items-center">
                    <CreditsCoinsSVG />
                    <div class="text-center">
                        <p class="font-semibold text-2xl">1233.68</p>
                        <p class="text-xs text-grey-4">credits</p>
                    </div>
                </div>
            </template>
            <template #footer>
                <Button 
                    type="button" 
                    label="Change to Plan" 
                    class="bg-white tracking-wide leading-[10px] h-[28px] font-semibold border text-dark-3 text-xs hover:bg-gray-100 mx-auto"
                    @click="handle_selected_type('plan')"
                />
            </template>
        </PlanCardSummary>

        <PlanCardSummary v-show="selected_type === 'plan'">
            <template #content>
                <div class="flex gap-6 w-full justify-center items-center">
                    <UserSVG class="text-primary" />
                    <div class="text-center">
                        <p class="font-semibold text-2xl">2000</p>
                        <p class="text-xs text-grey-4">numbers</p>
                    </div>
                </div>
            </template>
            <template #footer>
                <Button 
                    type="button" 
                    label="Change to Credits" 
                    class="bg-white tracking-wide leading-[10px] h-[28px] font-semibold border text-dark-3 text-xs hover:bg-gray-100 mx-auto"
                    @click="handle_selected_type('credit')" 
                />
            </template>
        </PlanCardSummary>
                
        <PanelRecap />
    </aside>
</template>

<script setup lang="ts">
    const selected_type = ref<SelectedBillingType>('credit')

    const emit = defineEmits(['update:selected_type'])

    const handle_selected_type = (select_type: SelectedBillingType) => {
        selected_type.value = select_type 
        emit('update:selected_type', selected_type.value)
    }
</script>