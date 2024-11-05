import {CouponCode} from "@/sanity/lib/sales/couponCodes";
import {defineQuery} from "next-sanity";
import {sanityFetch} from "@/sanity/lib/live";

export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {
    const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
        *[_type == "sale" && isActive == true && couponCode == $couponCode] | order(validFrom asc)[0]
        `);

    try {
        const activeSale = await sanityFetch({
            query: ACTIVE_SALE_BY_COUPON_QUERY,
            params:{
                couponCode,
            }
        })
        return activeSale ? activeSale.data : [];
    } catch (error) {
        console.error("Error fetching active sale by coupon code", error);
        return null;
    }
}