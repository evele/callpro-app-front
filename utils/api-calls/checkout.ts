type APIResponseCheckCoupon = APIResponseSuccess & {
    coupon_data: {
        couponCode: string;
        discountAmount: number;
        discountDisplay: string;
        finalPrice: number;
    }
}

export async function checkCoupon(data: CheckCouponParams):Promise<APIResponseCheckCoupon | APIResponseError>{
    return await fetchWrapper.post(CHECK_COUPON_URL, data) as APIResponseCheckCoupon | APIResponseError
}