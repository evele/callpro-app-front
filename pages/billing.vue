<template>
    <section class="bg-white py-2 pl-8 flex gap-3 items-center flex-wrap">
        <h2 class="text-2xl font-semibold">Plans and Billing</h2>
    </section>

    <div v-if="section_to_show === 'main'" class="p-6">
        <CardsSection 
            :user-plan-and-balance="user_plan_and_balance" 
            :user-cards-data="user_cards_data"
            :is-loading="is_loading_data" 
        />

        <div class="bg-white rounded-2xl mt-4 relative shadow-lg">
            <Tabs v-model:value="selected_tab">
                <div class="flex justify-between pt-7 pb-3 pl-10 pr-12">
                    <TabList class="flex items-center">
                        <Tab value="billing" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Billing history</Tab>
                        <Tab value="invoices" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10" :disabled="isLoadingInvoices">
                            Invoices
                        </Tab>
                    </TabList>
                </div>

                <TabPanels class="pl-10 pr-8 rounded-2xl">
                    <TabPanel value="billing">
                        <BillingHistoryTable :billing-data="billing_history_data" :is-loading="isLoadingBillingHistory" />
                    </TabPanel>
                    <TabPanel value="invoices">
                        <InvoicesTable :invoices-data="invoices_data" :is-loading="isLoadingInvoices" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <div v-if="section_to_show === 'buy_credits'" class="p-6 flex gap-4">
        <div class="bg-white rounded-2xl w-full h-[750px] shadow-lg"></div>
        <ContainerRight />
    </div>
</template>

<script setup lang="ts">
    const { data: userPlanAndBalance, isLoading: isLoadingUserPlan } = useFetchUserPlanAndBalance()
    const { data: userCardsData, isLoading: isLoadingUserCards } = useFetchUserCards()
    const { data: billingHistoryData, isLoading: isLoadingBillingHistory } = useFetchBillingHistory()
    const { data: invoicesData, isLoading: isLoadingInvoices } = useFetchInvoices()

    const selected_tab = ref('billing')

    type SectionToShow = 'main' | 'buy_credits'
    const section_to_show = ref<SectionToShow>('main')

    const user_plan_and_balance = computed(() => {
        if(!userPlanAndBalance?.value?.result) return null
        return userPlanAndBalance.value
    })

    const user_cards_data = computed(() => {
        if(!userCardsData?.value?.result) return []
        return userCardsData.value.cards
    })
    
    const billing_history_data = computed(() => {
        if(!billingHistoryData?.value?.result) return []
        return billingHistoryData.value.transactions
    })

    const invoices_data = computed(() => {
        if(!invoicesData?.value?.result) return []
        return invoicesData.value.invoices
    })

    const is_loading_data = computed(() => isLoadingUserPlan.value || isLoadingUserCards.value)
</script>

<style scoped lang="scss">
    :deep(.p-tabs) {
        .p-tablist {
            .p-tablist-content {
                align-items: center;
            }

            .p-tablist-tab-list {
                border: none;
                align-items: center;

                .p-tab-active {
                    background-color: rgba(208, 188, 255, 0.16);
                    color: #6750A4;
                }
                .p-tablist-active-bar {
                    display: none;
                }
            }
        }
    }
</style>
