import { useQuery } from '@tanstack/vue-query'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Dashboard ----- */
export const useFetchGetBroadcastList = (selected_tab, show, search) => {
  const dataToSend = computed(() => ({
    length_limit: show.value,
    load_all: false,
    search: search.value,
    start_limit: "0",
    state: selected_tab.value,
  }))

  return useQuery({
    queryKey: ['broadcast_list', dataToSend],
    queryFn: () => fetchWrapper.post(GET_BROADCAST_LIST_URL, dataToSend.value), 
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

