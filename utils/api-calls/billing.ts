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
code: string;
discount_type: string;
discount_value: number;
public: ZeroOrOne;
all_plans: ZeroOrOne;
times: string;
expiry_date: string;
}

type CouponDetails = {
couponCode: string;
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
status: ZeroOrOne;
coupon_details: CouponDetails | string; // Puede ser un string serializado o un objeto
invoice_data: string;
time_stamp: string;
}

type APIResponseInvoices = {
result: boolean;
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
  result:boolean;
  invoice_data: InvoiceData;
  invoice_coupon: InvoiceCoupon[];  
}

export async function getInvoiceDataToPrint(data:{trx_id: number}):Promise<InvoiceDataResponse | APIResponseError>{
  return await fetchWrapper.post(GET_INVOICE_DATA_TO_PRINT_URL,data) as InvoiceDataResponse  | APIResponseError
}