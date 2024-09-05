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
  item_desc: string;      // Descripción del ítem, parece ser un string.
  number: string;         // Número de la factura (id).
  date: string;           // Fecha de la factura.
  amount: string;         // Monto total de la factura.
  first_name: string;     // Primer nombre del usuario.
  last_name: string;      // Apellido del usuario.
  account_no: string;     // Número de cuenta del usuario.
  address: string;        // Dirección del usuario.
  email: string;          // Email del usuario.
  quantity: number;       // Cantidad, aparentemente siempre 1.
  cc_last_four: string;   // Últimos cuatro dígitos de la tarjeta de crédito.
};
type InvoiceCoupon = {
  id: string;             // ID del cupón.
  coupon_amount: string;  // Monto del cupón.
  coupon_details: string; // Detalles del cupón.
};

type InvoiceCouponArray = InvoiceCoupon[];

type InvoiceDataResponse = {
  result:boolean;                  // Indica si la operación fue exitosa.
  invoice_data?: InvoiceData;                // Datos de la factura.
  invoice_coupon?: InvoiceCouponArray;       // Lista de cupones asociados.
  validation_error?: Record<string, string>; // Errores de validación, si existen.
  db_error?: string;                         // Error de base de datos, si ocurre.
}

export async function getInvoiceDataToPrint(data:{trx_id: number}):Promise<InvoiceDataResponse>{
  const response = await fetchWrapper.post(GET_INVOICE_DATA_TO_PRINT_URL,data)
  console.log("aca estoy",response)
  return response as InvoiceDataResponse  
}