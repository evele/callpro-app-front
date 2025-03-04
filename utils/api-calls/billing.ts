type APIResponseInvoices = APIResponseSuccess & {
  invoices: Invoice[];
  }

export async function getUserInvoices():Promise<APIResponseInvoices | APIResponseError>{
  return await fetchWrapper.get(GET_USER_INVOICES_DATA_URL) as APIResponseInvoices | APIResponseError
}

type InvoiceData = {
  item_desc: string;
  number: number;
  date: string;
  amount: number;
  first_name: string;
  last_name: string;
  account_no: string;
  address: string;
  email: string;
  quantity: number;
  cc_last_four: string;
};

type InvoiceCoupon = {
  id: number;
  coupon_amount: number;
  coupon_details: CouponDetails;
};

type InvoiceDataResponse = APIResponseSuccess & {
  invoice_data: InvoiceData;
  invoice_coupon: InvoiceCoupon[];  
}

export async function getInvoiceDataToPrint(data:{trx_id: number}):Promise<InvoiceDataResponse | APIResponseError>{
  return await fetchWrapper.post(GET_INVOICE_DATA_TO_PRINT_URL,data) as InvoiceDataResponse  | APIResponseError
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

export async function saveBillingSettings(data:SaveBillingSettingsData):Promise<APIResponseSuccess | APIResponseError>{
  return await fetchWrapper.post(SAVE_BILLING_SETTINGS_URL,data) as APIResponseSuccess | APIResponseError
}

export async function getUserBillingSettings():Promise<APIResponseBillingSettings | APIResponseError>{
  return await fetchWrapper.get(GET_USER_BILLING_SETTINGS_URL) as APIResponseBillingSettings | APIResponseError
}