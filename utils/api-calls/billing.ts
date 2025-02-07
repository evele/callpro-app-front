type APIResponseInvoices = {
  result: true;
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

type InvoiceDataResponse = {
  result: true;
  invoice_data: InvoiceData;
  invoice_coupon: InvoiceCoupon[];  
}

export async function getInvoiceDataToPrint(data:{trx_id: number}):Promise<InvoiceDataResponse | APIResponseError>{
  return await fetchWrapper.post(GET_INVOICE_DATA_TO_PRINT_URL,data) as InvoiceDataResponse  | APIResponseError
}

type BillingHistoryResponse = {
  result: true;
  transactions: Transaction[];
}

export async function getBillingHistory():Promise<BillingHistoryResponse | APIResponseError>{
  return await fetchWrapper.get(GET_BILLING_HISTORY_URL) as BillingHistoryResponse | APIResponseError
}