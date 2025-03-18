import { useQuery } from '@tanstack/vue-query'

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Broadcast ----- */
export function useFetchGetBroadcastHeader(broadcast_id:Ref<number>){
  const dataToSend = computed(() => ({ broadcast_id: broadcast_id.value }))

  return useQuery({
    queryKey: ['broadcast_header', dataToSend],
    queryFn: () => getBroadcastHeader(dataToSend.value)    
  })
}
export const useFetchGetBroadcastDetail = (broadcast_id:Ref<number>, selected_tab:Ref<StateOption>,start_limit:Ref<number>, show:Ref<number>, search:Ref<string>) => {
  const dataToSend = computed(() => ({
    broadcast_id: broadcast_id.value,
    length_limit: show.value,
    search: search.value,
    start_limit: start_limit.value,//"0",
    state: selected_tab.value,
  }))
  return useQuery({
    queryKey: ['broadcast_detail', dataToSend],
    queryFn: () => getBroadcastDetail(dataToSend.value)    
  })
}
  
/* ----- Dashboard ----- */
export const useFetchGetBroadcastList = (selected_tab:Ref<DashboardState>, show:Ref<ItemsPerPageOption>, search:Ref<string>) => {
  const dataToSend = computed(() => ({
    length_limit: show.value.code,
    load_all: false,
    search: search.value,
    start_limit: "0", // It'll be dynamic when we implement pagination
    state: selected_tab.value,
  }))

  return useQuery({
    queryKey: ['broadcast_list', dataToSend],
    queryFn: () => getBroadcastList(dataToSend.value), 
  })
}

/* ----- Audios ----- */
export function useFetchGetAllAudios(showOlder:Ref<boolean>, is_enabled: boolean = true) {
  const dataToSend = computed(() => ({ show_all_audios: showOlder.value }));

  return useQuery({
      queryKey: ['user_all_audios', dataToSend],
      queryFn: () => getUserAllAudios(dataToSend.value),
      enabled: is_enabled,    
    });
}

export const useFetchGetAudio = (audio: Ref<Audio | null>) => {
  const dataToSend = computed(() => {
    return {
      audio_id: audio.value?.id || '',
      audio_full_url: audio.value?.full_file_url || '',
    }
  })

  return useQuery({
    queryKey: ['fetched_audio_to_play', dataToSend],
    queryFn: () => getUserAudio(dataToSend.value),
    enabled: false
  })
}

export function useDownloadAudio(file_name: Ref<string>) {
  const dataToSend = computed(() => ({
    file_name: file_name.value
  }));
  return useQuery({
    queryKey: ['audio_to_download', dataToSend],
    queryFn: () => downloadAudio(dataToSend.value),
    enabled: false,
  });
}

/* ----- Billing ----- */
export const useFetchInvoices = () => {
  return useQuery({
    queryKey: ['user_invoices'],
    queryFn: () => getUserInvoices(),
  })
}

export const useFetchInvoicesToPrint = (invoices_ids:Ref<string[]>, enabled: boolean) => {
  const dataToSend = computed(()=> ({
    trx_ids: invoices_ids.value
  }))
  return useQuery({
    queryKey: ['invoices_to_print', dataToSend],
    queryFn: () => getInvoicesDataToPrint(dataToSend.value),
    enabled   
  })
}

export const useFetchBillingHistory = () => {
  return useQuery({
    queryKey: ['user_billing_history'],
    queryFn: () => getBillingHistory(),
  })
}

export const useFetchUserPlanAndBalance = () => {
  return useQuery({
    queryKey: ['user_billing_data'],
    queryFn: () => getUserPlanAndBalance(),
  })
}

export const useFetchUserCards = () => {
  return useQuery({
    queryKey: ['user_cc_cards'],
    queryFn: () => getUserCards(),
  })
}

export const useFetchUserBillingSettings = () => {
  return useQuery({
    queryKey: ['user_billing_settings'],
    queryFn: () => getUserBillingSettings(),
  })
}

/* ----- Call in codes ----- */
export const useFetchCallInCodes = () => {
  return useQuery({
    queryKey: ['call_in_codes'],
    queryFn: () => getUserCallInCodes(),
  })
}

/* ----- Caller ID ----- */
export const useFetchCallerIDNumbers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['caller_id_numbers'],
    queryFn: () => getCallerIDNumbers(),
    enabled,
    refetchOnWindowFocus: false,
  })
}

/* ----- Chat ----- */
export const useFetchUnreadMessages = () => {
  return useQuery({
    queryKey: ['unread_chat_messages'],
    queryFn: () => getUnreadMessages(),
  })
}

export const useFetchChatContacts = (data:Ref<boolean>) => {
  type fnProps = { all_contacts: OneOrTwo };
  const dataToSend = computed((): fnProps => ({ all_contacts: data.value ? '1' : '2' }))
  return useQuery({
    queryKey: ['chat_contacts', dataToSend],
    queryFn: () => getChatContacts(dataToSend.value)
  })
}

/* ----- Contacts ----- */
export function useFetchAllContacts(query_params:Ref<AllContactsQueryParams>) {
  const dataToSend = computed(() => ({
    page: query_params.value.page,
    limit: query_params.value.show,
    with_groups: query_params.value.with_groups, // TODO: review this
    is_custom_group: query_params.value.is_custom_group, 
    group_id: query_params.value.group_id[0],
    filter: query_params.value.filter,
  }))
  return useQuery({
    queryKey: ['all_contacts', dataToSend],
    queryFn: () => getAllContacts(dataToSend.value), 
  })
}

export const useFetchContact = (contact_id:Ref<string>) => {
  const id = computed(() => ({ contact_id: contact_id.value }));
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContact(id.value),
    enabled: false
  })
}

export const useFetchDNCContacts = (page:Ref<number>, limit:Ref<number>, filter:Ref<string>) => {
  const dataToSend = computed(() => ({
    page: page.value,
    limit: limit.value,
    filter: filter.value,
  }))
  return useQuery({
    queryKey: ['dnc_contacts_filtered', dataToSend],
    queryFn: () => getDNCContacts(dataToSend.value)
  })
}

export const useFetchUserCustomGrups = () => {
  return useQuery({
    queryKey: ['user_custom_groups'],
    queryFn: () => getUserCustomGroups(),
  })
}

export const useFetchGetSystemGroups = () => {
  return useQuery({
    queryKey: ['system_groups'],
    queryFn: () => getSystemGroups(),
  })
}

export const useFetchGetCustomGroups = () => {
  return useQuery({
    queryKey: ['custom_groups'],
    queryFn: () => getCustomGroups(),
  })
}

export function useFetchDownloadContacts(group_id: Ref<string[]>, enabled: boolean = true) {  
  const dataToSend = computed(() => ({
    group_id: group_id.value[0]
  }));

  return useQuery({
    queryKey: ['download_contacts_file', dataToSend.value],
    queryFn: () => downloadContactsFile(dataToSend.value),
    enabled,
  });
} 

export function useFetchDownloadDNCContacts() {  
  return useQuery({
    queryKey: ['download_dnc_contacts_file'],
    queryFn: () => downloadDNCContactsFile(),
    enabled: false,
  });
}

/* ----- Did numbers ----- */
export const useFetchDidAndTollFreeNumbers = () => {
  return useQuery({
    queryKey: ['did_and_toll_free_numbers'],
    queryFn: () => getDidAndTollFreeNumbers(),
  })
}

/* ----- Packages ----- */
export const useFetchPackagesSteps = () => {
  return useQuery({
    queryKey: ['packages_steps'],
    queryFn: () => getPackagesSteps(),
  })
}

export const useFetchMonthlyGroupsPlans = () => {
  return useQuery({
    queryKey: ['monthly_groups_plans'],
    queryFn: () => getMonthlyGroupsPlans(),
  })
}

/* ----- Settings ----- */
export const useFetchSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
    refetchOnWindowFocus: false,
  })
}

/* ----- Sms ----- */
export const useFetchSms = (selected_tab:Ref<DashboardState>, show:Ref<ItemsPerPage>, search:Ref<string>) => {
  const dataToSend = computed(() => ({
    length_limit: show.value,    
    search: search.value,
    start_limit: "0", // It'll be dynamic when we implement pagination
    state: selected_tab.value,
  }))

  return useQuery({
    queryKey: ['sms_list', dataToSend],
    queryFn: () => getSmsList(dataToSend.value), 

  })
}

