<template>
    <section class="bg-white py-2 pl-8 flex gap-3 items-center flex-wrap">
        <h2 class="text-2xl font-semibold">Plans and Billing</h2>
    </section>

    <div v-if="section_to_show === B_MAIN" class="p-6">
        <Transition name="fade">
            <CardsSection v-if="!hide_cards"
                :user-plan-and-balance="user_plan_and_balance" 
                :user-cards-data="user_cards_data"
                :is-loading="is_loading_data"
                @hide-cards="handle_hide_cards(true, TAB_PAYMENTS)"
                @update:selected_type="handle_select_type"
            />
        </Transition>

        <div class="bg-white rounded-2xl relative shadow-lg transition-all duration-300 ease-in-out" :class="{'mt-4': !hide_cards }">
            <Tabs v-model:value="selected_tab">
                <div class="flex justify-between pt-7 pb-3 pl-10 pr-12 h-[90px]" :class="{'border-b pb-7': hide_cards }">
                    <TabList class="flex items-center">
                        <Tab :value="TAB_BILLING" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Billing history</Tab>
                        <Tab :value="TAB_INVOICES" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10" :disabled="isLoadingInvoices">
                            Invoices
                        </Tab>
                        <Tab v-show="hide_cards" :value="TAB_PAYMENTS" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">
                            Payments methods
                        </Tab>
                    </TabList>

                    <Transition>
                        <Button v-if="show_save_btn" class="h-9 ml-auto bg-primary hover:bg-[#6750A4] transition-colors" 
                            @click="save_cc_card_as_default" :disabled="isSavingDefaultCard"
                        >
                            <div class="flex items-center gap-2" v-if="isSavingDefaultCard">
                                <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner" animationDuration=".5s" aria-label="Saving" />
                                Saving...
                            </div>
                            <span v-else>Save as default</span>
                        </Button>
                    </Transition>
                </div>

                <TabPanels class="pl-10 pr-8 rounded-2xl">
                    <TabPanel :value="TAB_BILLING">
                        <BillingHistoryTable 
                            :billing-data="billing_history_data" 
                            :is-loading="isLoadingBillingHistory" 
                            :show-see-more="!hide_cards" 
                            @hide-cards="handle_hide_cards" 
                        />
                    </TabPanel>
                    <TabPanel :value="TAB_INVOICES">
                        <InvoicesTable 
                            :invoices-data="invoices_data" 
                            :is-loading="isLoadingInvoices"
                            :show-see-more="!hide_cards" 
                            @hide-cards="handle_hide_cards" 
                        />
                    </TabPanel>
                    <TabPanel :value="TAB_PAYMENTS">
                        <CreditCardsPanel 
                            :user-cards-data="user_cards_data" 
                            :is-loading="isLoadingUserCards"
                            :selected-card="selected_card"
                            @hide-cards="handle_hide_cards"
                            @add-card="handle_card_form"
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <div v-if="section_to_show === B_BUY_CREDITS" class="p-6 flex gap-4">
        <MainPanel 
            :selected-type="selected_type" 
            :user-billing-settings="billing_settings_data" 
            @update:sectionToShow="handle_section_to_show" 
        />
        <ContainerRight 
            :selected-type="selected_type" 
            :user-plan-and-balance="user_plan_and_balance"
            @update:selectedType="handle_select_type"
            @update:sectionToShow="handle_section_to_show"
        />
    </div>

    <section v-if="section_to_show === B_CHECKOUT_FORM" class="p-6">
        <TestCard />
        <!-- <CheckoutSection @update:sectionToShow="handle_section_to_show" /> -->
    </section>
    <AddCardForm :isVisible="show_card_form" @cancel="handle_card_form"/>

    <Toast />
</template>

<script setup lang="ts">
    const { data: userPlanAndBalance, isLoading: isLoadingUserPlan } = useFetchUserPlanAndBalance()
    const { data: userCardsData, isLoading: isLoadingUserCards } = useFetchUserCards()
    const { data: billingHistoryData, isLoading: isLoadingBillingHistory } = useFetchBillingHistory()
    const { data: invoicesData, isLoading: isLoadingInvoices } = useFetchInvoices()
    const { data: billingSettingsData, isLoading: isLoadingBillingSettings } = useFetchUserBillingSettings()
    const { mutate: saveDefaultCard, isPending: isSavingDefaultCard } = useSaveDefaultCard()

    const billingStore = useBillingStore()
    const { show_success_toast, show_error_toast } = usePrimeVueToast();

    const selected_tab = ref(TAB_BILLING)
    const selected_card = ref<CC_CARD | null>(null)
    const section_to_show = ref<BillingSectionToShow>(B_MAIN)
    const selected_type = ref<SelectedBillingType>(CREDIT)

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

    const billing_settings_data = computed(() => {
        if(!billingSettingsData?.value?.result) return null
        return billingSettingsData.value.billing_settings
    })

    const handle_select_type = (type: SelectedBillingType) => {
        selected_type.value = type
        section_to_show.value = B_BUY_CREDITS
    }

    const is_loading_data = computed(() => isLoadingUserPlan.value || isLoadingUserCards.value)

    const handle_hide_cards = (val: boolean, tab?: string) => {
        hide_cards.value = val
        if(tab) selected_tab.value = tab
    }

    const show_save_btn = computed(() => {
        if(!selected_card.value) return false
        return selected_tab.value === TAB_PAYMENTS && selected_card.value.is_default !== '1' && selected_card.value.expiry_state !== ExpiryState.EXPIRED
    })

    const save_cc_card_as_default = () => {
        if(!selected_card?.value?.id) {
            show_error_toast('Error', 'Card ID not found')
            return
        }
        if(selected_card.value.expiry_state === ExpiryState.EXPIRED) {
            show_error_toast('Error', 'Cannot set an expired card as default')
            return
        }

        const data_to_send = { card_id: selected_card.value.id }

        saveDefaultCard(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_success_toast('Success', 'Card set as default')
                    setTimeout(() => selected_card.value = null, 1000)
                } else {
                    show_error_toast('Error', response.error || 'Failed to set card as default')
                }  
            },
            onError: () => {
                show_error_toast('Error', 'Failed to set card as default')
            }
        })
    }

    const handle_section_to_show = (section: BillingSectionToShow) => {
        section_to_show.value = section
        if(section_to_show.value === B_MAIN) {
            billingStore.resetStore()
        }
    }

    const show_card_form = ref(false)

    const handle_card_form = (should_show:boolean) => {
        console.log('its called',should_show)
        show_card_form.value = should_show
    }

    onBeforeUnmount(() => billingStore.resetStore())
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

    :deep(.light-spinner) {
        .p-progressspinner-circle {
            stroke: white!important;
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

    .fade-enter-active {
        transition: opacity 0.7s ease;
    }

    .fade-enter-from {
        opacity: 0;
    }
</style>
