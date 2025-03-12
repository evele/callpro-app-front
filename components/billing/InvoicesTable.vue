<template>
    <div class="flex flex-col">
        <div class="flex-grow overflow-hidden">

            <div v-if="!props.showSeeMore" class="flex justify-between items-center w-full mt-2 mb-6">
                <IconField class="w-full max-w-[300px]">
                    <InputIcon>
                        <SearchSVG class="text-grey-secondary" />
                    </InputIcon>
                    <InputText class="py-2 w-full text-sm" placeholder="Search by invoice name" v-model="search" />
                </IconField>

                <Transition>
                    <Button 
                        v-show="selected_invoices.length > 0"
                        type="button"
                        @click="handle_download" 
                        class="bg-transparent flex items-center py-2 px-3 rounded-9 gap-3 text-dark-blue hover:bg-gray-100 hover:shadow-lg border-none"
                        :disabled="is_downloading"
                    >
                        <ProgressSpinner v-if="is_downloading" strokeWidth="8" fill="transparent" class="h-5 w-5 dark-spinner"
                            animationDuration=".5s" aria-label="Downloading"                             
                        />
                        <DownloadSVG v-else />
                        <span class="font-semibold text-sm">{{ is_downloading ? 'Downloading...' : 'Download' }}</span>
                    </Button>
                </Transition>
            </div>

            <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 6px"></ProgressBar>

            <DataTable v-else
                :value="formatted_invoices_data" 
                scrollable
                :scrollHeight="props.showSeeMore ? '384px' : '450px'"
                dataKey="id" 
                class="invoices-table"
                stripedRows
                v-model:selection="selected_invoices"
                selectionMode="multiple"
                :rowClass="rowClass"
            >

            <Column selectionMode="multiple" :headerStyle="[{ width: '3rem' }, selected_header_style]"></Column>

            <Column field="name" header="Invoice" :headerStyle="selected_header_style">
                <template #body="slotProps">
                    <div class="flex items-center gap-3">
                        <PDFSVG class="text-grey-secondary" />
                        <span class="text-sm text-dark-2 font-medium">{{ slotProps.data.name }}</span>
                    </div>
                </template>
            </Column>

            <Column field="date" header="Billing Date" class="text-center min-w-[150px]" :headerStyle="selected_header_style">
                <template #body="slotProps">
                    <span class="text-sm text-grey-5">{{ slotProps.data.date }}</span>
                </template>
            </Column>

            <Column field="purchase_type" header="Purchase Type" class="text-center" :headerStyle="selected_header_style">
                <template #body="slotProps">
                    <span 
                        class="text-sm font-black" 
                        :class="[slotProps.data.class]"
                    >
                        {{ slotProps.data.purchase_type }}
                    </span>
                </template>
            </Column>

            <Column field="description" header="Description" class="text-center" :headerStyle="selected_header_style">
                <template #body="slotProps">
                    <span class="text-sm text-grey-5 font-black">{{ slotProps.data.description }}</span>
                </template>
            </Column>
            </DataTable>
        </div>
        <Button 
            v-show="props.showSeeMore"
            type="button" 
            class="mt-4 text-purple-main bg-transparent border-none text-sm font-medium w-fit self-end hover:scale-110 transition-transform"
            @click="emit('hide-cards', true)"
        >
            See more
            <ArrowRightSVG class="w-4 h-4" />
        </Button>
        <Button 
            v-show="!props.showSeeMore"
            type="button" 
            class="mt-4 text-purple-main bg-transparent border-none text-sm font-medium w-fit self-end hover:scale-110 transition-transform"
            @click="emit('hide-cards', false)"
        >
            <ArrowLeftSVG class="w-3 h-3" />
            Go to main
        </Button>

        <div v-if="invoices_to_print.length > 0" class="overflow-hidden h-0">
            <section 
                v-for="invoice in invoices_to_print" 
                :key="invoice.id"
                :id="`invoice-${invoice.invoice_id}`"
                class="main-content" 
            >
                <h2 class="heading">The CallPro</h2>
                <p>3 Teverya Way #301</p>
                <p>Monroe NY 10950</p>
                <p>(845) 378-1500</p>

                <h1 class="font-bold">Invoice</h1>
                <p>{{ invoice.invoice_data?.date.slice(0,10) }}</p>
                <h3>Invoice for:</h3>
                <p>Name: {{ invoice.invoice_data?.last_name + ' ' + invoice.invoice_data?.first_name }}</p>
                <p>Ivr: {{ invoice.invoice_data?.account_no }}</p>
                <p>Address: {{ invoice.invoice_data?.address }}</p>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { jsPDF } from "jspdf";
    import html2canvas from "html2canvas";

    const props = defineProps<{
        invoicesData: Invoice[],
        isLoading: boolean,
        showSeeMore: boolean
    }>()

    const emit = defineEmits<{
        (event: 'hide-cards', value: boolean): void
    }>()

    const search = ref('')

    type FormattedInvoice = {
        id: string,
        name: string,
        date: string,
        purchase_type: string,
        description: string
        class: string
    }

    const formatted_invoices_data = computed((): FormattedInvoice[] => {
        return [...props.invoicesData].map((invoice: Invoice) => {
            const [invoice_type, text_color] = kind_of_type(invoice.package_type)
            return {
                id: invoice.id,
                name: 'Invoice-' + invoice.id,
                date: format_timestamp(invoice.time_stamp),
                purchase_type: invoice_type,
                description: get_invoice_description(invoice.invoice_data),
                class: text_color
            }
        }).reverse()
    })

    const kind_of_type = (type: StringOrNull) => {
        switch (type) {
            case null:
                return ['Other', 'text-grey-5']
            case 'PAUG':
                return ['PAUG', 'text-secondary-hover']
            case 'GROUPS':
                return ['Monthly Plan', 'text-primary']
            case 'CREDITS':
                return ['Credits', 'text-[#E1FF8D]']
            default:
                return ['Other', 'text-grey-5']
        }
    }

    const get_invoice_description = (desc: string) => {
        if(!desc) return ''
        let splitted_description = desc.split(':')
        return splitted_description[1] ? splitted_description[1].trimStart() : splitted_description[0]
    }

    const selected_invoices = ref([])
    const invoices_ids = computed(() => selected_invoices.value.map((invoice: FormattedInvoice) => invoice.id))
    const invoices_to_print = ref<InvoicesInfo[]>([])
    const is_downloading = ref(false)

    const all_selected = computed(() => selected_invoices.value.length === formatted_invoices_data.value.length)
    const selected_header_style = computed(() => all_selected.value ? { backgroundColor: '#9A83DB', color: '#fff' } : {})

    const rowClass = (data: any) => {
        return [{ '!bg-[#E9DDFF]': selected_invoices.value.some((invoice: FormattedInvoice) => invoice.id === data.id) }];
    };

    const { refetch: getInvoicesDataToPrint } = useFetchInvoicesToPrint(invoices_ids, false)
    const { show_success_toast, show_error_toast } = usePrimeVueToast();
    const handle_download = async () => {
        if(!invoices_ids.value.length) return

        try {
            is_downloading.value = true
            const response = await getInvoicesDataToPrint()
            if (!response.data?.result) {
                show_error_toast('Error', 'An error occurred while downloading invoices')
                is_downloading.value = false
                return
            }
            invoices_to_print.value = response.data.invoices_info
            setTimeout(() => {
                invoices_to_print.value.forEach((invoice: InvoicesInfo) => handlePrintPDF(invoice.invoice_id))
            }, 200);
        } catch (error) {
            show_error_toast('Error', 'An error occurred while downloading invoices')
            is_downloading.value = false
        }
    }

    const handlePrintPDF = (invoice_id: number) => {
        const element = document.querySelector(`#invoice-${invoice_id}`);

        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth / canvas.width);

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice-${invoice_id}.pdf`);
        }).then(() => {
            invoices_to_print.value = invoices_to_print.value.filter((invoice: InvoicesInfo) => invoice.invoice_id !== invoice_id)
            if(!invoices_to_print.value.length) {
                selected_invoices.value = []
                is_downloading.value = false
                show_success_toast('Success', 'Invoices downloaded successfully')
            }
        })
    }
</script>

<style scoped lang="scss">
    :deep(.invoices-table) {
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
            th:not(:nth-child(2)) {
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

    :deep(.p-checkbox) {
        border: none;
        width: 18px;
        height: 18px;
        .p-checkbox-input, .p-checkbox-box {
            border: 2px solid #49454F;
            border-radius: 1.5px;
            width: 18px;
            height: 18px;
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

    :deep(.dark-spinner) {
        .p-progressspinner-circle {
            stroke: #757575!important;
        }
    }
</style>