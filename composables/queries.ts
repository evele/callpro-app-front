import { useQuery } from '@tanstack/vue-query'

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Broadcast ----- */
export function useFetchGetBroadcastHeader(broadcast_id:Ref<string>){
  const dataToSend = computed(() => ({ broadcast_id: broadcast_id.value }))

  return useQuery({
    queryKey: ['broadcast_header', dataToSend],
    queryFn: () => getBroadcastHeader(dataToSend.value)    
  })
}
export const useFetchGetBroadcastDetail = (broadcast_id:Ref<string>, selected_tab:Ref<StateOption>,start_limit:Ref<number>, show:Ref<number>, search:Ref<string>) => {
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
export function useFetchGetAllAudios(showOlder:Ref<boolean>) {
  const dataToSend = computed(() => ({ show_all_audios: showOlder.value }));

  return useQuery({
      queryKey: ['user_all_audios', dataToSend],
      queryFn: () => getUserAllAudios(dataToSend.value),      
    });
}

export const useFetchGetAudio = (audio_id: Ref<string | null>, audio_full_url:Ref<string | null>, called_from: string) => {
  const dataToSend = computed(() => ({ 
    audio_id: audio_id.value, 
    audio_full_url: audio_full_url.value,
    called_from
  }))

  return useQuery({
    queryKey: ['user_converted_audio', dataToSend],
    queryFn: () => getUserConvertedAudios(dataToSend.value),
  })
}

/* ----- Billing ----- */
export const useFetchInvoices = () => {
  return useQuery({
    queryKey: ['user_invoices'],
    queryFn: () => getUserInvoices(),
  })
}

export const useFetchInvoiceToPrint = (invoice_id:Ref<number>) => {
  const dataToSend = computed(()=> ({
    trx_id: invoice_id.value
  }))
  //{ trx_id: invoice_id } // TODO: maybe will need to use computed
  return useQuery({
    queryKey: ['invoices', dataToSend],
    queryFn: () => getInvoiceDataToPrint(dataToSend.value),      
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
export const useFetchCallerID = () => {
  return useQuery({
    queryKey: ['caller_id'],
    queryFn: () => getCallerID()
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

export const useFetchContact = (contact_id:Ref<string>) => {
  const id = computed(() => ({ contact_id: contact_id.value }));
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContact(id.value),
    enabled: false
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


export function useFetchDownloadContacts(group_id:Ref<string>,enabled: boolean = true) {  
  const dataToSend = computed(() => ({
    group_id: group_id.value
  }));

  return useQuery({
    queryKey: ['download_contacts_file', dataToSend.value],
    queryFn: () => downloadContactsFile(dataToSend.value),
    enabled,
  });
}