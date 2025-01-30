<template>
    <div class="flex gap-5">
        <BillingCardContainer v-show="show_credits" title="Your plan" type="credits">
            <template #content>
                <div class="flex pl-6 w-full justify-between items-center">
                    <CoinsSVG />
                    <div class="w-[60%]">
                        <p class="flex items-center gap-3"><span class="font-semibold text-2xl">2000</span>numbers</p>
                    </div>
                </div>
            </template>

            <template #footer>
                <Button 
                    type="button" 
                    label="Select UMP" 
                    class="bg-white tracking-wide w-28 leading-[10px] h-[28px] font-semibold border text-dark-3 text-xs hover:bg-gray-100"
                    @click="show_credits = false"
                />
                <Button 
                    type="button"
                    label="Add more credits"
                    class="leading-[10px] tracking-wide font-semibold text-xs h-[28px]"
                />
            </template>
        </BillingCardContainer>

        <BillingCardContainer v-show="!show_credits" title="Your plan" type="monthly">
            <template #content>
                <div class="flex pl-6 w-full justify-between">
                    <MonthlySVG class="text-primary" />
                    <div class="w-[60%]">
                        <p class="flex items-center gap-3"><span class="font-semibold text-2xl">1233.68</span>credits</p>
                    </div>
                </div>
            </template>

            <template #footer>
                <Button 
                    type="button" 
                    label="Change to Credits" 
                    class="bg-white tracking-wide leading-[10px] h-[28px] font-semibold border text-dark-3 text-xs hover:bg-gray-100"
                    @click="show_credits = true" 
                />
                <Button 
                    type="button"
                    label="Upgrade plan"
                    class="leading-[10px] tracking-wide font-semibold text-xs h-[28px]"
                />
            </template>
        </BillingCardContainer>

        <BillingCardContainer title="Payment method" type="card">
            <template #content>
                <div class="flex pl-6 w-full justify-between items-center">
                    <VisaSVG />
                    <p class="font-semibold text-lg flex flex-col">
                        Visa ending in 1234
                        <span class="text-grey-4 text-base font-normal">Expiry 01/26</span>
                    </p>
                    
                    <Tag 
                        value="Default" 
                        class="border-2 border-green-positive-primary bg-white text-green-positive-primary rounded-lg py-[6px] text-xs leading-[10px] self-start"
                    />
                </div>
            </template>

            <template #footer>
                <Button 
                    type="button"
                    class="bg-dark-blue text-white rounded-xl hover:bg-gray-700"
                >
                    <EditIconSVG class="w-4 h-4" />
                    Edit
                </Button>
            </template>
        </BillingCardContainer>
    </div> 
</template>

<script setup lang="ts">
    const show_credits = ref(true)
</script>