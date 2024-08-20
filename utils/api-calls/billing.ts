type PaymentMethodDetails = {
    card_number: string;
    card_holder: string;
  }
  
interface PaymentMethodData {
payment_method: string;
payment_method_details: PaymentMethodDetails;
}

interface SuccessResult {
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

interface CardResponse {
success_result: SuccessResult;
}

interface ResponseData {
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

interface CouponDetails {
couponCode: string;//TODO en teoria puede ser string
discountDisplay: string;
discountAmount: number;
finalPrice: number;
coupon_id: number;
couponDb: CouponDb;
}

interface Invoice {
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

export interface APIResponse {
result: boolean;
invoices: Invoice[];
}
  