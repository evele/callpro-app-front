<template>
    <div class="flex flex-col">
        <div class="flex-grow overflow-hidden">

            <div v-if="!props.showSeeMore" class="w-full mt-2 mb-6">
                <IconField class="w-full max-w-[300px]">
                    <InputIcon>
                        <SearchSVG class="text-grey-secondary" />
                    </InputIcon>
                    <InputText class="py-2 w-full text-sm" placeholder="Search by description name" v-model="search" />
                </IconField>
            </div>

            <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 6px"></ProgressBar>

            <DataTable v-if="isLoading" 
                :value="fake_data"
                scrollable
                scrollHeight="384px"
                class="billing-table"
                stripedRows
            >
                <Column field="description" header="Description" class="w-[34%]">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
                <Column field="date" header="Date" class="w-[22%]">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
                <Column field="credits_used" header="Total credits used" class="w-[22%]">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
                <Column field="credits_remaining" header="Total credits remaining" class="w-[22%]">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
            </DataTable>

            <DataTable v-else
                :value="formatted_billing_data" 
                scrollable
                :scrollHeight="props.showSeeMore ? '384px' : '450px'"
                dataKey="id" 
                class="billing-table"
                stripedRows
            >
                <Column field="description" header="Description">
                    <template #body="slotProps">
                        <span class="text-sm font-medium text-grey-5" v-if="slotProps.data.description.type === 'text'">
                            {{ slotProps.data.description.text }}
                        </span>
                        <span v-else class="text-sm font-medium text-grey-5">
                            <NuxtLink 
                                :to="slotProps.data.description.to" 
                                target="_blank" 
                                class="text-purple-main"
                            >
                                {{ slotProps.data.description.text_link }}
                            </NuxtLink>
                            {{ slotProps.data.description.text }}
                        </span>
                    </template>
                </Column>

                <Column field="date" header="Date" class="text-center min-w-[150px]">
                    <template #body="slotProps">
                        <span class="text-sm text-grey-5">{{ slotProps.data.date }}</span>
                    </template>
                </Column>

                <Column field="credits_used" header="Total credits used" class="text-center">
                    <template #body="slotProps">
                        <span class="text-sm font-semibold" :class="[slotProps.data.credits_used < 0 ? 'text-danger-2' : 'text-green-positive-primary']">
                            {{ parseFloat(slotProps.data.credits_used) }}
                        </span>
                    </template>
                </Column>

                <Column field="credits_remaining" header="Total credits remaining" class="text-center">
                    <template #body="slotProps">
                        <span class="text-sm font-bold text-grey-5">{{ parseFloat(slotProps.data.credits_remaining).toFixed(2) }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
        <Button 
            v-show="props.showSeeMore"
            type="button" 
            class="mt-4 text-purple-main bg-transparent border-none text-sm font-medium w-fit self-end hover:scale-110 transition-transform"
            @click="emit('hide-cards', false)"
        >
            See more
            <ArrowRightSVG class="w-4 h-4" />
        </Button>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        billingData: Transaction[],
        isLoading: boolean,
        showSeeMore: boolean
    }>()

    const emit = defineEmits(['hide-cards'])

    const search = ref('')

    const fake_data = ref(new Array(4));

    const formatted_billing_data = computed(() => {
        let balance = 0
        return [...props.billingData].map((transaction: Transaction) => {
            balance += Number(transaction.amount)
            return {
                id: transaction.id,
                description: get_transaction_description_to_show(transaction),
                date: format_timestamp(transaction.time_stamp),
                credits_used: transaction.amount,
                credits_remaining: balance
            }
        }).reverse()
    })

    const get_transaction_description_to_show = (transaction: Transaction) => {
        type Description = {
            type: 'text' | 'link',
            text_link: string,
            'text': string,
            to: { name: string, params?: {} } | null
        }
        const description: Description = {
            type: 'text',
            text_link: '',
            text: '',
            to: null
        }

        switch (transaction.type) {
            case 'BROADCAST':
                description.text = `Audio broadcast: ${transaction.b_name ?? ''}`
                if (transaction.soft_deleted != '1') {
                    description.type = 'link'
                    description.text_link = 'Audio broadcast:'
                    description.text = ` ${transaction.b_name ?? ''}`
                    description.to = { name: 'dashboard' }
                }
                break;

            case 'SMS':
                description.text = `Text broadcast: ${transaction.s_name ?? ''}`
                if (transaction.soft_deleted != '1') {
                    description.type = 'link'
                    description.text_link = 'Text broadcast:'
                    description.text = ` ${transaction.s_name ?? ''}`
                    description.to = { name: 'dashboard' }
                }
                break;

            case 'PAYMENT':
                description.text = 'Credit Purchase:'
                if (transaction.description && transaction.description.length > 0) {
                    description.text = `${transaction.description}`
                }

                if (transaction.parent_id !== null) {
                    description.text_link = 'Credits Purchase:'
                    description.text = `${transaction.description ?? ''}`
                    description.type = 'link'
                    description.to = { name: 'print_invoice-id', params: { id: transaction.parent_id } }
                }
                break;

            case 'CHARGE':
                description.text = transaction.description ?? ''
                break;

            case 'CHAT':
                description.text = `Chat: ${format_timestamp(transaction.time_stamp)}`
                break;
        }

        return description
    }
</script>

<style scoped lang="scss">
    :deep(.billing-table) {
        min-width: 30rem;

        .p-datatable-thead, .p-datatable-header-cell {
            background-color: rgb(233, 231, 235);

            &:first-child {
                border-top-left-radius: 6px;
            }
            &:last-child {
                border-top-right-radius: 6px;
            }
        }

        tr {
            th:not(:first-child) {
                .p-datatable-column-header-content {
                    display: flex;
                    justify-content: center;
                }
            }
        }

        td {
            height: 69px;
        }
    }
</style>