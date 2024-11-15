import { NextApiRequest, NextApiResponse } from 'next';
import { backendClient } from "@/sanity/lib/backendClient";
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { code, desc, success, data, signature } = req.body;

            // Kiểm tra dữ liệu yêu cầu có hợp lệ hay không
            if (!code || !desc || success === undefined || !signature) {
                return res.status(400).json({ message: "Invalid payload" });
            }

            // TODO: Kiểm tra chữ ký `signature` để xác thực tính hợp lệ của dữ liệu
            const isValidSignature = verifySignature(data, signature); // Tạo hàm này theo yêu cầu của bạn
            if (!isValidSignature) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (success) {
                // Cập nhật trạng thái đơn hàng trong Sanity (hoặc cơ sở dữ liệu khác)
                const orderCode = data.orderCode; // Ví dụ, giả sử `data` chứa mã đơn hàng
                await backendClient
                    .patch(orderCode)
                    .set({ status: 'success' })  // Cập nhật trạng thái thành công
                    .commit();

                console.log(`Order ${orderCode} đã cập nhật trạng thái thành công`);
                return res.status(200).json({ message: "Order updated to success" });
            } else {
                console.log(`Lỗi thanh toán: ${desc}`);
                return res.status(200).json({ message: `Payment failed: ${desc}` });
            }

        } catch (error) {
            console.error("Error processing webhook:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

// Hàm xác thực chữ ký (giả sử bạn có một hàm để kiểm tra chữ ký)
function verifySignature(data: any, signature: string): boolean {
    // Chuyển dữ liệu sang chuỗi JSON
    const dataString = JSON.stringify(data);

    // Tạo hash từ dữ liệu và secret key
    const hmac = crypto.createHmac("sha256", process.env.PAYOS_SECRET_KEY!);
    hmac.update(dataString);
    const generatedSignature = hmac.digest("hex");

    // So sánh chữ ký tạo ra với chữ ký từ PayOS
    return generatedSignature === signature;
}