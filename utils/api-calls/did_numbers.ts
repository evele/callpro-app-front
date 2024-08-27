type DidAndTollFreeNumbersAPIResponse = {
    result: boolean,
    did_numbers?: DidNumber,
    toll_free_numbers?: DidNumber,
    did_error?: string,
    toll_free_error?: string,
}

export async function getDidAndTollFreeNumbers(): Promise<DidAndTollFreeNumbersAPIResponse>{
    const response = await fetchWrapper.get(GET_DID_AND_TOLL_FREE_NUMBERS_URL) 
    return response as DidAndTollFreeNumbersAPIResponse
}