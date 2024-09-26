type DidAndTollFreeNumbersAPIResponse = {
    result: true,
    did_numbers: DidNumber[],
    toll_free_numbers: DidNumber[],      
}

export async function getDidAndTollFreeNumbers(): Promise<DidAndTollFreeNumbersAPIResponse | APIResponseError>{
    return await fetchWrapper.get(GET_DID_AND_TOLL_FREE_NUMBERS_URL)  as DidAndTollFreeNumbersAPIResponse | APIResponseError
}