import { TabOption, StateOption } from '../utils/api-calls/broadcast';
<template>
    <div>
        <p class="text-title">Broadcast page</p>
        <div style="margin-left: 1rem;">
            <input type="text" v-model.number="broadcast_id" placeholder="Write the broadcast ID">
            <button @click="get_broadcast_data">Get broadcast data</button>
            <p v-if="isLoading">Loading broadcasts...</p>
            <p v-if="isError">{{ error?.message }}</p>
            <div v-if="bHeaderIsSuccess && bHeaderData?.result">
                <p>Broadcast name: 
                    <span style="font-weight: bold;">{{ bHeaderData?.broadcast?.[0].name }}</span>
                </p>
            </div>
        </div>

        <ul class="tab-style">
            <li v-for="option in tab_options" :key="option" class="tab-style__li" 
                :class="[ selected_tab === option ? 'selected-tab' : '' ]" @click="filter_broadcast_detail(option)">
                {{ option }}
            </li>
        </ul>

        <div class="filter-container">
            <div>
                <label for="show" style="margin-right: 6px;">Show:</label>
                <select name="show" id="show" v-model="show" @change="handleRefetch">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                </select>
            </div>

            <div>
                <label for="search" style="margin-right: 6px;">Search:</label>
                <input type="text" name="search" id="search" placeholder="Search..." @input="debounceSearch">
            </div>
        </div>

        <p style="margin-left: 1rem;" v-if="bDetailIsLoading">Loading broadcasts...</p>
        <p style="margin-left: 1rem;" v-if="bDetailIsError && !bDetailData?.result">{{errorDetail}}</p>
        <ul v-if="bDetailIsSuccess && bDetailData?.result">                        
            <li v-for="broadcast in bDetailData?.broadcast_details" :key="broadcast?.id" style="margin: 10px 0;">
                <span style="font-weight: 600; margin-right: 6px;">Broadcast ID:</span><span style="margin-right: 10px; color: blue;"> {{ broadcast?.broadcast_id }}</span> 
                <span style="font-weight: 600; margin-right: 6px;">Broadcast result:</span><span style="margin-right: 10px; color: blue;"> {{ broadcast?.result }}</span> 
                <span style="font-weight: 600; margin-right: 6px;">Duration:</span><span style="margin-right: 10px; color: blue;"> {{ broadcast?.duration }}</span> 
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    const handleRefetch = (event: Event) => {
        bDetailRefetch()
    }
    // const broadcast_id = ref('')
    const broadcast_id = ref<number>(0)
    const tab_options: StateOption[] = [BROADCAST_ALL, LIVE, VM, INVALID, NA]
    const selected_tab:Ref<StateOption> = ref(BROADCAST_ALL)
    const start_limit = ref(0)
    const show = ref(5)
    const search = ref('')

    const { data: bHeaderData, isLoading, isSuccess: bHeaderIsSuccess, isError, error, refetch: bHeaderRefetch } = useFetchGetBroadcastHeader(broadcast_id)

    const { data: bDetailData, isLoading: bDetailIsLoading, isSuccess: bDetailIsSuccess, isError: bDetailIsError,error:errorDetail, refetch: bDetailRefetch } = useFetchGetBroadcastDetail(broadcast_id, selected_tab,start_limit, show, search)

    let searchDebounce: ReturnType<typeof setTimeout> // TODO: check if this works
   
   const debounceSearch = (e: Event) => {        
       clearTimeout(searchDebounce);
       searchDebounce = setTimeout(() => {
           const target = e.target as HTMLInputElement;
           search.value = target.value
           bDetailRefetch()
       }, 500) 
   }

    const filter_broadcast_detail = (option:StateOption) => {
        selected_tab.value = option
        // bDetailRefetch() TODO: check this behavior later
    }

    const get_broadcast_data = () => {
        bHeaderRefetch()
        bDetailRefetch()
    }
    
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .tab-style {
        display: flex;
        list-style-type: none;
        padding: 0;
        gap: 1rem;
        margin-left: 1rem;
        margin-top: 3rem;
    }
    .tab-style__li {
        color: gray;
        background-color: transparent;
        transition: background-color 0.3s;
        font-weight: bold;
        border: 1px solid gray;
        padding: 6px 1rem;
    }
    .tab-style__li:hover {
        cursor: pointer;
        color: white;
        background-color: gray;
    }
    .selected-tab {
        color: white;
        background-color: gray;
    }
    .filter-container {
        display: flex;
        gap: 1.4rem;
        margin: 1rem 0 0 1rem;
    }
</style>