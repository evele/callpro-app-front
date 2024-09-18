type DidAndTollFreeNumbersAPIResponse = {
    result: true,
    did_numbers: DidNumber[],
    toll_free_numbers: DidNumber[],  
    // TODO aca tengo que ver el back para ver si es necesario o como unificar a APIResponseError
    // did_error?: string, 
    // toll_free_error?: string,  
}

export async function getDidAndTollFreeNumbers(): Promise<DidAndTollFreeNumbersAPIResponse | APIResponseError>{
    return await fetchWrapper.get(GET_DID_AND_TOLL_FREE_NUMBERS_URL)  as DidAndTollFreeNumbersAPIResponse | APIResponseError
}