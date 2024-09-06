type PaymentMethodDetails = {
    card_number: string;
    card_holder: string;
  }
  
type PaymentMethodData = {
payment_method: string;
payment_method_details: PaymentMethodDetails;
}

type SuccessResult = {
xResult: string;
xStatus: string;
xError: string;
xErrorCode: string;
xRefNum: string;
xExp: string;
xDate: string;
xAuthCode: string;
xBatch: string;
xAvsResultCode: string;
xAvsResult: string;
xCvvResultCode: string;
xCvvResult: string;
xAuthAmount: string;
xToken: string;
xMaskedCardNumber: string;
xCardType: string;
query_data: {
    xKey: string;
    xVersion: string;
    xSoftwareName: string;
    xSoftwareVersion: string;
    xCommand: string;
    xToken: string;
    xAmount: number;
};
}

type CardResponse = {
success_result: SuccessResult;
}

type ResponseData ={
success: boolean;
card_response: CardResponse;
}

type CouponDb = {
id: number;
code: string;//TODO en teoria puede ser string
discount_type: string;
discount_value: number;
public: "1" | "0";
all_plans: "1" | "0";
times: string;//TODO 100?
expiry_date: string;
}

type CouponDetails = {
couponCode: string;//TODO en teoria puede ser string
discountDisplay: string;
discountAmount: number;
finalPrice: number;
coupon_id: number;
couponDb: CouponDb;
}

type Invoice = {
id: number;
confirmation_number: number;
user_id: number;
payment_method_data: PaymentMethodData;
total: number;
response_data: ResponseData | string; // Puede ser un string serializado o un objeto
status:  "1" | "0";
coupon_details: CouponDetails | string; // Puede ser un string serializado o un objeto
invoice_data: string;
time_stamp: string;
}

export type APIResponse = {
result: boolean;
invoices: Invoice[];
}

export async function getUserInvoices():Promise<APIResponse>{
  const response = await fetchWrapper.get(GET_USER_INVOICES_DATA_URL)
  return response as APIResponse
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

type validation_keys = 'trx_id'

type InvoiceDataResponse = {
  result:boolean;
  invoice_data?: InvoiceData;
  invoice_coupon?: InvoiceCoupon[];
  validation_error?: Record<validation_keys,string>
  db_error?: string;
}

export async function getInvoiceDataToPrint(data:{trx_id: number}):Promise<InvoiceDataResponse>{
  const response = await fetchWrapper.post(GET_INVOICE_DATA_TO_PRINT_URL,data)  
  return response as InvoiceDataResponse  
}