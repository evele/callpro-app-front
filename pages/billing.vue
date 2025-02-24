<template>
    <section class="bg-white py-2 pl-8 flex gap-3 items-center flex-wrap">
        <h2 class="text-2xl font-semibold">Plans and Billing</h2>
    </section>

    <div v-if="section_to_show === 'main'" class="p-6">
        <CardsSection v-if="!hide_cards"
            :user-plan-and-balance="user_plan_and_balance" 
            :user-cards-data="user_cards_data"
            :is-loading="is_loading_data"
            @hide-cards="handle_hide_cards"
        />

        <div class="bg-white rounded-2xl relative shadow-lg" :class="{'mt-4': !hide_cards }">
            <Tabs v-model:value="selected_tab">
                <div class="flex justify-between pt-7 pb-3 pl-10 pr-12 h-[90px]" :class="{'border-b pb-7': hide_cards }">
                    <TabList class="flex items-center">
                        <Tab value="billing" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Billing history</Tab>
                        <Tab value="invoices" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10" :disabled="isLoadingInvoices">
                            Invoices
                        </Tab>
                        <Tab v-show="hide_cards" value="payments" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">
                            Payments methods
                        </Tab>
                    </TabList>

                    <Transition>
                        <Button v-if="show_save_btn" class="h-9 ml-auto bg-primary hover:bg-[#6750A4] transition-colors" 
                            @click="save_cc_card_as_default"
                        >
                            Save as default
                        </Button>
                    </Transition>
                </div>

                <TabPanels class="pl-10 pr-8 rounded-2xl">
                    <TabPanel value="billing">
                        <BillingHistoryTable 
                            :billing-data="billing_history_data" 
                            :is-loading="isLoadingBillingHistory" 
                            :show-see-more="!hide_cards" 
                            @hide-cards="handle_hide_cards" 
                        />
                    </TabPanel>
                    <TabPanel value="invoices">
                        <InvoicesTable 
                            :invoices-data="invoices_data" 
                            :is-loading="isLoadingInvoices"
                            :show-see-more="!hide_cards" 
                            @hide-cards="handle_hide_cards" 
                        />
                    </TabPanel>
                    <TabPanel value="payments">
                        <CreditCardsPanel 
                            :user-cards-data="user_cards_data" 
                            :is-loading="isLoadingUserCards"
                            @selected-card="handle_card_selection"
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <div v-if="section_to_show === 'buy_credits'" class="p-6 flex gap-4">
        <MainPanel :selected_type="selected_type" />
        <ContainerRight @update:selected_type="handle_select_type" />
    </div>

    <section v-if="section_to_show === 'checkout_form'" class="p-6">
        <CheckoutSection />
    </section>
</template>

<script setup lang="ts">
    const { data: userPlanAndBalance, isLoading: isLoadingUserPlan } = useFetchUserPlanAndBalance()
    const { data: userCardsData, isLoading: isLoadingUserCards } = useFetchUserCards()
    const { data: billingHistoryData, isLoading: isLoadingBillingHistory } = useFetchBillingHistory()
    const { data: invoicesData, isLoading: isLoadingInvoices } = useFetchInvoices()
    const { mutate: saveDefaultCard, isPending: isSavingDefaultCard } = useSaveDefaultCard()

    const selected_tab = ref('billing')
    const selected_card = ref<CC_CARD | null>(null)

    type SectionToShow = 'main' | 'buy_credits' | 'checkout_form'
    const section_to_show = ref<SectionToShow>('main')

    const selected_type = ref<SelectedBillingType>('credit')

    const hide_cards = ref(false)

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

    const handle_select_type = (type: SelectedBillingType) => {
        selected_type.value = type
    }

    const is_loading_data = computed(() => isLoadingUserPlan.value || isLoadingUserCards.value)

    const handle_hide_cards = (val: boolean) => {
        hide_cards.value = true
        if(val) selected_tab.value = 'payments'
    }

    const show_save_btn = computed(() => {
        if(!selected_card.value) return false
        return selected_tab.value === 'payments' && selected_card.value.is_default !== '1' && selected_card.value.expiry_state !== ExpiryState.EXPIRED
    })

    const handle_card_selection = (card: CC_CARD) => {
        selected_card.value = card
    }

    const save_cc_card_as_default = () => {
        console.log('Save as default:', selected_card.value)
    }
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

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>
