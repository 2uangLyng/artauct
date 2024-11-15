"use server";

import { BasketItem } from "@/store/store";
import payos from "@/lib/payOS";
import { CheckoutRequestType } from "@payos/node/lib/type";
import { backendClient } from "@/sanity/lib/backendClient";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
};

export type GroupedBasketItem = {
    product: BasketItem["product"];
    quantity: number;
}


export async function createCheckoutSession(
    items: GroupedBasketItem[],
    metadata: Metadata,
) {

    function generateOrderCode(orderNumber: any): number {
        const uuid = crypto.randomUUID();
        const numericPart = parseInt(uuid.replace(/[^0-9]/g, "").slice(0, 15)); // Lấy phần số từ UUID và cắt bớt nếu cần
        return numericPart;
    }

    function generateRanDomOrder(): string {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        return `ORD${randomNumber}`;
    }

    try {
        const itemWithoutPrice = items.filter((item) => !item.product.price);
        if (itemWithoutPrice.length > 0) {
            throw new Error("Product price is missing");
        }
        const customerEmail = metadata.customerEmail;
        const maxExpireTime = 2147483647;  // Giới hạn của 32-bit timestamp
        const thirtyMinutesInSeconds = 30 * 60;  // 30 phút tính bằng giây

        // Tính toán expiration time trong phạm vi giới hạn
        let expiredAt = Math.floor(Date.now() / 1000) + thirtyMinutesInSeconds;
        if (expiredAt > maxExpireTime) {
            expiredAt = maxExpireTime;  // Giới hạn lại thời gian hết hạn không vượt quá giá trị tối đa
        }


        const checkoutRequest: CheckoutRequestType = {
            orderCode: generateOrderCode(metadata.orderNumber),
            amount: items.reduce((total, item) => total + item.product.price! * item.quantity, 0),
            description: generateRanDomOrder(),
            cancelUrl: `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL}/basket`,
            returnUrl: `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL}/success?order_number=${metadata.orderNumber}`,
            items: items.map(item => ({
                name: item.product.name || "Unnamed Product",
                quantity: item.quantity,
                price: item.product.price!,
                // price: Math.round(item.product.price! * 100),  // PayOS có thể yêu cầu giá trị theo đơn vị nhỏ nhất (ví dụ: VND)
            })),
            buyerName: metadata.customerName,
            buyerEmail: customerEmail,
            expiredAt: expiredAt,  // Ví dụ: 30 phút sau khi tạo session
        };
        console.log('Checkout Request:', checkoutRequest);

        const session = await payos.createPaymentLink(checkoutRequest);
        console.log('Checkout Response:', session);
        // const res = await payos.verifyPaymentWebhookData()
        if (session.status == 'PENDING') {
            await saveOrderToSanity(session, items, metadata);
        }
        return session.checkoutUrl;
    } catch (error) {
        console.error(">>> Error: ", error);
        throw error;
    }

}

async function saveOrderToSanity(session: any, items: GroupedBasketItem[], metadata: Metadata) {
    try {
        // Tạo đơn hàng trong Sanity
        const order = await backendClient.create({
            _type: "order",
            orderNumber: session.orderCode.toString(),
            customerName: metadata.customerName,
            clerkUserId: metadata.clerkUserId,
            email: metadata.customerEmail,
            product: items.map(item => ({
                _key: crypto.randomUUID(),
                product: {
                    _type: "reference",
                    _ref: item.product._id, // Lưu ID sản phẩm từ hệ thống của bạn
                },
                quantity: item.quantity,
            })),
            totalPrice: session.amount,
            currency: session.currency,
            amountDiscount: 0,
            status: "paid",
            orderDate: new Date().toISOString(),
        });

        console.log("Order saved:", order);
    } catch (error) {
        console.error("Error saving order to Sanity:", error);
    }
}

