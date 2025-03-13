<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :closable="false" class="w-full max-w-[700px] mx-4">
        <template #header>
            <header class="w-full flex justify-between pb-5 px-8">
                <h2 class="flex items-center gap-4 font-bold text-2xl text-black">Caller IDs</h2>
                <Button @click="handle_close_modal" class="bg-transparent border-none text-black hover:bg-gray-200"><CloseSVG /></Button>
            </header>
            <Divider class="absolute left-0 top-[75px]" />
        </template>

        <div class="flex justify-between w-full mb-7 mt-1">
            <div class="flex items-center gap-4">
                <Button v-show="show_verify_btn" @click="handle_verify_number" :disabled="disable_resend_btn || disable_all"
                    class="rounded-md h-9 pl-2 bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white"
                >
                    <ProgressSpinner v-if="verify_is_pending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Deleting number" />
                    <CheckSVG v-else class="w-7 h-7" />
                    <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ verify_is_pending ? 'Verifying...' : 'Verify Number' }}</span>
                </Button>

                <Button v-show="!show_verify_btn" @click="handle_verify_number" :disabled="disable_resend_btn || disable_all"
                    class="rounded-md h-9 bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white"
                >
                    <ProgressSpinner v-if="verify_is_pending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Deleting number" />
                    <CallOutSVG v-else class="w-4 h-4" />
                    <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ verify_is_pending ? 'Resending...' : 'Resend Call' }}</span>
                </Button>

                <Button @click="handle_delete_number" :disabled="disable_action_btn || disable_all"
                    class="rounded-md h-9 bg-white border-[#49454F] shadow-lg text-[#49454F] hover:bg-gray-200 disabled:bg-white"
                >
                    <ProgressSpinner v-if="delete_is_pending" class="w-5 h-5" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Deleting number" />
                    <TrashSVG v-else class="w-5 h-5" />
                    <span class="text-sm font-semibold tracking-wider leading-none pt-[2px]">{{ delete_is_pending ? 'Deleting...' : 'Delete Number' }}</span>
                </Button>
            </div>
        </div>

        <ProgressBar :class="[isFetching ? 'opacity-1' : 'opacity-0']" mode="indeterminate" style="height: 6px"></ProgressBar>
        <div v-if="caller_id_numbers" class="w-full max-h-[380px] overflow-y-auto rounded-tl-xl rounded-tr-xl">
            <table class="w-full text-gray-700 border border-gray-200 border-collapse">
                <thead class="sticky -top-[1px] z-[100] bg-[#e9e9e9]">
                    <tr class="bg-[#e9e9e9] h-[38px] text-[#1D1B20] font-medium border-b border-gray-300">
                        <th class="px-8 w-20"></th>
                        <th class="px-4 text-left text-sm font-medium">Caller ID</th>
                        <th class="px-4 text-center text-sm font-medium">Ext.</th>
                        <th class="px-4 text-center text-sm font-medium">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr 
                        v-if="caller_id_numbers.length"
                        v-for="number in caller_id_numbers"
                        :key="number.id"
                        class="pt-4 pb-[15px] h-[70px] odd:bg-[#f4f4f4] even:bg-white cursor-pointer hover:bg-[#efe9f7]"
                        :class="{ '!bg-[#ebddff]': selected_caller_id?.id === number.id }"
                        @click="selected_caller_id = number"
                    >
                        <td class="text-center">
                            <RadioButton v-model="selected_caller_id" :inputId="'ID-' + number.id" :value="number" />
                        </td>

                        <td>{{ format_number_to_show(number.caller_id) }}</td>

                        <td class="text-center">
                            <span>{{ number.ext }}</span>
                        </td>

                        <td class="text-center">
                            <VerifiedSVG v-if="number.status === CallerIDStatus.CONFIRMED" class="w-5 h-5 text-verified mx-auto" />
                            <PendingSVG v-if="number.status === CallerIDStatus.PENDING || number.status === CallerIDStatus.UNVERIFIED" class="w-5 h-5 text-pending mx-auto" />
                            <RejectedSVG v-if="number.status === CallerIDStatus.REJECTED" class="w-5 h-5 text-unverified mx-auto" />
                        </td>
                    </tr>
                    <tr v-else>
                        <td class="text-center" colspan="4">{{ isFetching ? 'Loading numbers...' : 'No numbers found' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <form @submit.prevent class="w-full mt-7">
            <div class="flex gap-4 items-center w-full justify-end">
                <PhoneInput :model-value="new_number" @update:modelValue="(v: string) => new_number = v" class="max-w-[170px]"
                    :form-action="form_action" @hasError="(val: boolean) => has_phone_number_error = val" :border-radius="'rounded-[10px]'"
                />
                
                <label for="ext" class="text-sm font-semibold text-[#1D1B20]">Ext.</label>
                <InputText 
                    id="ext"
                    :value="new_ext"
                    @input="handle_change_ext"
                    class="w-[58px] py-2 px-3 text-center rounded-[10px] placeholder-grey-7 transition-colors"
                    placeholder="xxx"
                />
                
                <Button @click="add_new_number" :class="[ add_is_pending ? 'w-32' : 'w-24']" class="bg-[#1D192B] border-none rounded-xl text-white hover:bg-[#322F35] disabled:bg-[#848287]"
                    :disabled="disabled_add_new_btn || add_is_pending || disable_all">
                    <div class="flex items-center gap-2" v-if="add_is_pending">
                        <ProgressSpinner strokeWidth="8" fill="transparent" class="h-5 w-5 light-spinner"
                            animationDuration=".5s" aria-label="Adding contact to DNC"                             
                        />
                        Adding
                    </div>
                    <div class="flex items-center gap-2" v-else>
                        <PlusSVG class="w-6 h-6" />
                        <span class="text-sm">Add</span>
                    </div>
                </Button>
            </div>
        </form>


        <footer class="flex justify-center w-full font-bold mt-[38px] mb-10">
            <Button @click="handle_close_modal" class="w-[300px]" :disabled="add_is_pending || disable_all">
                Close
            </Button>
        </footer>
    </Dialog>

    <ConfirmationModal ref="confirmationModal" title="Confirmation" @confirm="confirm_delete_number">
        <p class="text-lg font-medium">Are you sure you want to send the selected number to trash?</p>
    </ConfirmationModal>
</template>

<script setup lang="ts">
    import VerifiedSVG from '../svgs/VerifiedSVG.vue'
    import PendingSVG from '../svgs/PendingSVG.vue'
    import RejectedSVG from '../svgs/RejectedSVG.vue'
    import CallOutSVG from '../svgs/CallOutSVG.vue'
    import CheckSVG from '../svgs/CheckSVG.vue'
    import TrashSVG from '../svgs/TrashSVG.vue'

    const { data: callerIDNumbers, isFetching, refetch: getCallerIDNumbers } = useFetchCallerIDNumbers(false)
    const { mutate: add_caller_id, isPending: add_is_pending } = useSaveCallerIDNumber()
    const { mutate: verify_caller_id, isPending: verify_is_pending } = useVerifyCallerIDNumber()
    const { mutate: delete_caller_id, isPending: delete_is_pending } = useDeleteCallerIDNumber()

    const visible = ref(false)
    const new_number = ref('')
    const new_ext = ref('')
    const form_action = ref('')
    const has_phone_number_error = ref(false)
    const confirmationModal = ref()

    const emit = defineEmits(['update:selected-caller-id', 'update:deleted_number'])

    const statusPriority = {
        [CallerIDStatus.CONFIRMED]: 1,
        [CallerIDStatus.PENDING]: 2,
        [CallerIDStatus.UNVERIFIED]: 3,
        [CallerIDStatus.REJECTED]: 4
    }

    const caller_id_numbers = computed((): CallerIDExt[] => {
        if(!callerIDNumbers?.value?.result) return []
        return [...callerIDNumbers.value.caller_ids]
                    .filter((item: CallerID) => item.user_id !== '-999')
                    .sort((a: CallerID, b: CallerID) => statusPriority[a.status] - statusPriority[b.status])
                    .map((item: CallerID) => {
                        return {
                            ...item,
                            caller_id: item.caller_id.split('#')[0],
                            ext: item.caller_id.split('#')[1] || ''
                        }
                    })
    })

    const selected_caller_id = ref<CallerIDExt | null>(null)

    const disable_resend_btn = computed(() => !selected_caller_id.value?.id || selected_caller_id.value?.status === CallerIDStatus.CONFIRMED)
    const disable_action_btn = computed(() => !selected_caller_id.value?.id)
    const disabled_add_new_btn = computed(() => !new_number.value || has_phone_number_error.value)
    const disable_all = computed(() => add_is_pending.value || verify_is_pending.value || delete_is_pending.value)
    const show_verify_btn = computed(() => selected_caller_id.value?.id && selected_caller_id.value?.status === CallerIDStatus.REJECTED)

    const open = (caller_id: string | undefined) => {
        if(caller_id) {
            selected_caller_id.value = caller_id_numbers.value.find((item: CallerIDExt) => item.caller_id === caller_id) || null
        }
        visible.value = true;
    }

    const close = () => {
        selected_caller_id.value = null
        new_number.value = ''
        new_ext.value = ''
        visible.value = false;
    }

    const handle_close_modal = () => close()

    const { show_error_toast, show_success_toast } = usePrimeVueToast();

    defineExpose({ open })

    // To keep the selected number in sync with the list
    watch(() => caller_id_numbers.value, () => {
        if(selected_caller_id.value?.id) {
            selected_caller_id.value = caller_id_numbers.value.find((item: CallerIDExt) => item.id === selected_caller_id.value?.id) || null
        }
    })

    const handle_change_ext = (e: Event) => {
        const target = e.target as HTMLInputElement;
        target.value = target.value.replace(/\D/g, '');
        if(target.value.length > 3) target.value = target.value.slice(0, 3)
        new_ext.value = target.value
    }

    // Add new Number
    const add_new_number = () => {
        form_action.value = ''
        let caller_id_to_save
        if(new_ext.value !== '') {
            caller_id_to_save = format_number_to_send(new_number.value) + '#' + new_ext.value
        } else {
            caller_id_to_save = format_number_to_send(new_number.value)
        }

        const data_to_send = {
            caller_id: caller_id_to_save
        }

        type saveCallerIDNumberResponseSuccess = APIResponseSuccess & {
            success_message: string;
        }

        add_caller_id(data_to_send, {
            onSuccess: (response: saveCallerIDNumberResponseSuccess | APIResponseError) => {
                if(response.result) {
                    new_number.value = ''
                    new_ext.value = ''
                    form_action.value = 'clear'
                    show_success_toast('success', response.success_message)
                    getCallerIDNumbers()
                } else {
                    show_error_toast('error', 'Error adding number...')
                }
            },
            onError: () => show_error_toast('error', 'Error adding number...')
        })
    }

    const handle_verify_number = () => {
        if(!selected_caller_id.value) {
            show_error_toast('Validation error', 'Please select a number to verify')
            return
        }

        let caller_id_to_save
        if(selected_caller_id.value.ext) {
            caller_id_to_save = selected_caller_id.value.caller_id + '#' + selected_caller_id.value.ext
        } else {
            caller_id_to_save = selected_caller_id.value.caller_id
        }

        const data_to_send: CallerIDToVerify = {
            caller_id: caller_id_to_save,
            status: CallerIDStatus.REJECTED
        }

        verify_caller_id(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_success_toast('success', 'We will call you shortly to confirm the Caller ID.')
                    getCallerIDNumbers()
                } else {
                    show_error_toast('error', 'Something failed while verifying the number...')
                }
            },
            onError: () => show_error_toast('error', 'Something failed while verifying the number...')
        })
    }

    const handle_delete_number = () => {
        if(!selected_caller_id.value) {
            show_error_toast('Validation error', 'Please select a number to delete')
            return
        }

        confirmationModal.value?.open()
    }

    const confirm_delete_number = () => {
        if(!selected_caller_id.value) return

        const data_to_send: CallerIDToDelete = {
            caller_id: selected_caller_id.value.caller_id
        }

        delete_caller_id(data_to_send, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_success_toast('success', 'Number deleted successfully.')
                    getCallerIDNumbers()
                    emit('update:deleted_number', selected_caller_id.value?.caller_id)
                    selected_caller_id.value = null
                } else {
                    show_error_toast('error', 'Something failed while deleting the number...')
                }
            },
            onError: () => show_error_toast('error', 'Something failed while deleting the number...')
        })
    }
</script>