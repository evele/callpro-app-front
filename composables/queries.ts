import { useQuery } from '@tanstack/vue-query'

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Broadcast ----- */
export const useFetchGetBroadcastHeader = (broadcast_id:Ref<number>) => {
  const dataToSend = computed(() => ({ broadcast_id: broadcast_id.value }))

  return useQuery({
    queryKey: ['broadcast_header', dataToSend],
    queryFn: () => fetchWrapper.post(GET_BROADCAST_HEADER_URL, dataToSend.value),
    enabled: false, 
  })
}

export const useFetchGetBroadcastDetail = (broadcast_id:Ref<number>, selected_tab:Ref<string>, show:Ref<number>, search:Ref<string>) => {
  const dataToSend = computed(() => ({
    broadcast_id: broadcast_id.value,
    length_limit: show.value,
    search: search.value,
    start_limit: "0",
    state: selected_tab.value,
  }))
  return useQuery({
    queryKey: ['broadcast_detail', dataToSend],
    queryFn: () => fetchWrapper.post(GET_BROADCAST_DETAIL_URL, dataToSend.value),
    enabled: false, 
  })
}
  
/* ----- Dashboard ----- */
export const useFetchGetBroadcastList = (selected_tab:Ref<string>, show:Ref<number>, search:Ref<string>) => {
  const dataToSend = computed(() => ({
    length_limit: show.value,
    load_all: false,
    search: search.value,
    start_limit: "0", // It'll be dynamic when we implement pagination
    state: selected_tab.value,
  }))

  return useQuery({
    queryKey: ['broadcast_list', dataToSend],
    queryFn: () => fetchWrapper.post(GET_BROADCAST_LIST_URL, dataToSend.value), 
  })
}

/* ----- Audios ----- */
export function useFetchGetAllAudios(showOlder:Ref<boolean>) {
  const data_to_send = computed(() => ({ show_all_audios: showOlder.value }));

  return useQuery({
      queryKey: ['user_all_audios', showOlder],
      queryFn: () => fetchWrapper.post(GET_AUDIOS_URL, data_to_send.value),
    });
}

export const useFetchGetAudio = (audio_id: Ref<string>, audio_full_url:Ref<string>, called_from: string) => {
  const dataToSend = computed(() => ({ 
    audio_id: audio_id.value,
    audio_full_url: audio_full_url.value,
    called_from
  }))

  return useQuery({
    queryKey: ['user_converted_audio', dataToSend],
    queryFn: () => fetchWrapper.post(GET_AUDIO_URL, dataToSend.value),
    enabled: false,
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

export const useFetchInvoiceToPrint = (invoice_id:Ref<number>) => {
  const id = { trx_id: invoice_id } // TODO: maybe will need to use computed
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

export const useFetchChatContacts = (data:Ref<boolean>) => {
  const dataToSend = computed(() => ({ all_contacts: data.value ? '1' : '2' }))
  return useQuery({
    queryKey: ['chat_contacts', dataToSend],
    queryFn: () => fetchWrapper.post(GET_CHAT_CONTACTS_URL, dataToSend.value),
  })
}

/* ----- Contacts ----- */
export const useFetchContact = (contact_id:Ref<number>) => {
  const id = computed(() => ({ contact_id: contact_id.value }));
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => fetchWrapper.post(GET_CONTACT_URL, id.value),
    enabled: false
  })
}

export const useFetchUserCustomGrups = () => {
  return useQuery({
    queryKey: ['user_custom_groups'],
    queryFn: () => fetchWrapper.get(GET_USER_CUSTOM_GROUPS_URL),
  })
}

export const useFetchGetSystemGroups = () => {
  return useQuery({
    queryKey: ['system_groups'],
    queryFn: () => fetchWrapper.get(GET_SYSTEM_GROUPS_URL),
  })
}

export const useFetchGetCustomGroups = () => {
  return useQuery({
    queryKey: ['custom_groups'],
    queryFn: () => fetchWrapper.get(GET_CUSTOM_GROUPS_URL),
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

/* ----- Sms ----- */
export const useFetchSms = (selected_tab:Ref<string>, show:Ref<number>, search:Ref<string>) => {
  const dataToSend = computed(() => ({
    length_limit: show.value,    
    search: search.value,
    start_limit: "0", // It'll be dynamic when we implement pagination
    state: selected_tab.value,
  }))

  return useQuery({
    queryKey: ['sms_list', dataToSend],
    queryFn: () => fetchWrapper.post(GET_SMS_DATA_URL, dataToSend.value), 

  })
}  
  /* ----- Contacts ----- */
export function useFetchAllContacts(page:Ref<number>, limit:Ref<number>, with_groups:Ref<boolean>,is_custom_group:Ref<boolean>,group_id:Ref<string>,filter:Ref<string>){
  const dataToSend = computed(() => ({
    page: page.value,
    limit: limit.value,
    with_groups: with_groups.value, // TODO: review this
    is_custom_group:is_custom_group.value, 
    group_id:group_id.value,
    filter:filter.value,
  }))
  return useQuery({
    queryKey: ['all_contacts', dataToSend],
    queryFn: () => getAllContacts(dataToSend.value), 
  })
}
