import { useQuery } from '@tanstack/vue-query'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Audios ----- */
export function useFetchGetAllAudios(showOlder) {
  const data_to_send = computed(() => ({ show_all_audios: showOlder.value }));

  return useQuery({
      queryKey: ['user_all_audios', showOlder],
      queryFn: () => fetchWrapper.post(GET_AUDIOS_URL, data_to_send.value),
    });
}

export const useFetchGetAudio = (data) => {
  return useQuery({
    queryKey: ['user_converted_audio'],
    queryFn: () => fetchWrapper.post(GET_AUDIO_URL, dataToSend),
  })
}

/* ----- Billing ----- */
export const useFetchInvoices = () => {
  return useQuery({
    queryKey: ['user_invoices'],
    queryFn: () => fetchWrapper.get(GET_USER_INVOICES_DATA_URL),
    refetchOnWindowFocus: false,
  })
}

export const useFetchInvoiceToPrint = (invoice_id) => {
  const id = { trx_id: invoice_id }
  return useQuery({
    queryKey: ['invoices', invoice_id],
    queryFn: () => fetchWrapper.post(GET_INVOICE_DATA_TO_PRINT_URL, id),
    refetchOnWindowFocus: false,
  })
}

/* ----- Call in codes ----- */
export const useFetchCallInCodes = () => {
  return useQuery({
    queryKey: ['call_in_codes'],
    queryFn: () => fetchWrapper.get(GET_USER_CALL_IN_CODES_URL),  
  })
}

/* ----- Caller ID ----- */
export const useFetchCallerID = () => {
  return useQuery({
    queryKey: ['caller_id'],
    queryFn: () => fetchWrapper.get(GET_CALLER_IDS_URL),  
  })
}

/* ----- Chat ----- */
export const useFetchUnreadMessages = () => {
  return useQuery({
    queryKey: ['unread_chat_messages'],
    queryFn: () => fetchWrapper.get(GET_UNREAD_MESSAGES_URL),
  })
}

export const useFetchChatContacts = (data) => {
  const dataToSend = { all_contacts: data === true ? 1 : 2 }
  return useQuery({
    queryKey: ['chat_contacts'],
    queryFn: () => fetchWrapper.post(GET_CHAT_CONTACTS_URL, dataToSend),
  })
}

/* ----- Did numbers ----- */
export const useFetchDidAndTollFreeNumbers = () => {
  return useQuery({
    queryKey: ['did_and_toll_free_numbers'],
    queryFn: () => fetchWrapper.get(GET_DID_AND_TOLL_FREE_NUMBERS_URL),
  })
}

/* ----- Packages ----- */
export const useFetchPackagesSteps = () => {
  return useQuery({
    queryKey: ['packages_steps'],
    queryFn: () => fetchWrapper.get(GET_PACKAGE_STEPS_URL),
  })
}

export const useFetchMonthlyGroupsPlans = () => {
  return useQuery({
    queryKey: ['monthly_groups_plans'],
    queryFn: () => fetchWrapper.get(GET_MONTHLY_GROUPS_PLANS_URL),
  })
}

/* ----- Settings ----- */
export const useFetchSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => fetchWrapper.get(GET_SETTINGS_DATA_URL),
    refetchOnWindowFocus: false,
  })
}
/* ----- Contacts ----- */
export const useFetchAllContacts = (page, limit, with_groups,is_custom_group,group_id,filter) => {
  const dataToSend = computed(() => ({
    page: page.value,
    limit: limit.value,
    with_groups: with_groups.value,
    is_custom_group:is_custom_group.value,
    group_id:group_id.value,
    filter:filter.value,
  }))

  return useQuery({
    queryKey: ['all_contacts', dataToSend],
    queryFn: () => fetchWrapper.post(GET_ALL_CONTACTS_URL, dataToSend.value), 
  })
}