<template>
    <section class="bg-white py-2 pl-8 flex gap-3 items-center flex-wrap">
        <h2 class="text-2xl font-semibold">Plans and Billing</h2>
    </section>

    <div class="p-6 mb-10 min-h-28">Aca los cards</div>

    <div class="bg-white rounded-2xl mt-4 mb-6 mx-6 relative shadow-lg">
        <Tabs v-model:value="selected_tab">
            <div class="flex justify-between pt-7 pb-3 px-12">
                <TabList class="flex items-center">
                    <Tab value="billing" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Billing history</Tab>
                    <Tab value="invoices" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Invoices</Tab>
                </TabList>
            </div>

            <TabPanels class="pl-12 pr-8 rounded-2xl">
                <TabPanel value="billing">
                    <BillingHistoryTable :billing-data="billing_data" :is-loading="isLoadingBilling" />
                </TabPanel>
                <TabPanel value="invoices">
                    <InvoicesTable :invoices-data="invoices_data" :is-loading="isLoadingInvoices" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
    const { data: billingData, isLoading: isLoadingBilling } = useFetchBillingHistory()
    const { data: invoicesData, isLoading: isLoadingInvoices } = useFetchInvoices()

    const selected_tab = ref('billing')

    const billing_data = computed(() => {
        if(!billingData?.value?.result) return []
        return billingData.value.transactions
    })

    const invoices_data = computed(() => {
        if(!invoicesData?.value?.result) return []
        return invoicesData.value.invoices
    })
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