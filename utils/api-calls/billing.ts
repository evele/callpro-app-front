type APIResponseInvoices = APIResponseSuccess & {
  invoices: Invoice[];
  }

export async function getUserInvoices():Promise<APIResponseInvoices | APIResponseError>{
  return await fetchWrapper.get(GET_USER_INVOICES_DATA_URL) as APIResponseInvoices | APIResponseError
}

export async function getInvoicesDataToPrint(data:{trx_ids: number[]}):Promise<InvoicesDataResponse | APIResponseError>{
  return await fetchWrapper.post(GET_INVOICES_DATA_TO_PRINT_URL,data) as InvoicesDataResponse  | APIResponseError
}

type BillingHistoryResponse = APIResponseSuccess & {
  transactions: Transaction[];
}

export async function getBillingHistory():Promise<BillingHistoryResponse | APIResponseError>{
  return await fetchWrapper.get(GET_BILLING_HISTORY_URL) as BillingHistoryResponse | APIResponseError
}

type UserPlanAndBalanceResponse = APIResponseSuccess & {
  user_current_plan: UserCurrentPlanData;
  balance_data: NumberOrNull;
}

export async function getUserPlanAndBalance():Promise<UserPlanAndBalanceResponse | APIResponseError>{
  return await fetchWrapper.get(GET_USER_PLAN_AND_BALANCE_URL) as UserPlanAndBalanceResponse | APIResponseError
}

type UserCardsResponse = APIResponseSuccess & {
  cards: CC_CARD[];
}

export async function getUserCards():Promise<UserCardsResponse | APIResponseError>{
  return await fetchWrapper.get(GET_USER_CC_CARDS_URL) as UserCardsResponse | APIResponseError
}


/* ----- SAVE DEFAULT CC CARD ----- */
export async function saveDefaultCard(data:{ card_id: number }):Promise<APIResponseSuccess | APIResponseError>{
  return await fetchWrapper.post(SAVE_DEFAULT_CC_CARD_URL, data) as APIResponseSuccess | APIResponseError
}

/* ----- BILLING SETTINGS ----- */
export async function saveBillingSettings(data:SaveBillingSettingsData):Promise<APIResponseSuccess | APIResponseError>{
  return await fetchWrapper.post(SAVE_BILLING_SETTINGS_URL,data) as APIResponseSuccess | APIResponseError
}

export async function getUserBillingSettings():Promise<APIResponseBillingSettings | APIResponseError>{
  return await fetchWrapper.get(GET_USER_BILLING_SETTINGS_URL) as APIResponseBillingSettings | APIResponseError
}

export async function setPendingDowngrade(data: PendingDowngradeData):Promise<APIResponseSuccess | APIResponseError>{
  return await fetchWrapper.post(SET_PENDING_DOWNGRADE_URL, data) as APIResponseSuccess | APIResponseError
}

export async function cancelDowngrade():Promise<APIResponseSuccess | APIResponseError>{
  return await fetchWrapper.post(CANCEL_DOWNGRADE_URL) as APIResponseSuccess | APIResponseError
}