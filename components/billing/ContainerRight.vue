<template>
    <aside class="flex flex-col justify-center gap-4">
        <PlanCardSummary v-show="show_credits">
            <template #content>
                <div class="flex gap-6 w-full justify-center items-center">
                    <CoinsSVG />
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
                    @click="show_credits = false"
                />
            </template>
        </PlanCardSummary>

        <PlanCardSummary v-show="!show_credits">
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
                    @click="show_credits = true" 
                />
            </template>
        </PlanCardSummary>
                
        <PanelRecap />
    </aside>
</template>

<script setup lang="ts">
    const show_credits = ref(true)
</script>