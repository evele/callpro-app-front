import { useQuery } from '@tanstack/vue-query'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Dashboard ----- */
export const useFetchGetBroadcastHeader = (broadcast_id) => {
  const dataToSend = computed(() => ({ broadcast_id: broadcast_id.value }))

  return useQuery({
    queryKey: ['broadcast_header', dataToSend],
    queryFn: () => fetchWrapper.post(GET_BROADCAST_HEADER_URL, dataToSend.value),
    enabled: false, 
  })
}

export const useFetchGetBroadcastDetail = (broadcast_id, selected_tab, show, search) => {
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

export const useFetchSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => sleep(2000).then(() => fetchWrapper.get(GET_SETTINGS_DATA_URL)) ,  
  })
}

export const useFetchCallInCodes = () => {
  return useQuery({
    queryKey: ['call_in_codes'],
    queryFn: () => sleep(2000).then(() => fetchWrapper.get(GET_USER_CALL_IN_CODES_URL)) ,  
  })
}

