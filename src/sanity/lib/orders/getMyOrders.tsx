import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getMyOrders(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const MY_ORDERS_QUERY = defineQuery(
    `*[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
    ...,
    product[] {
      ...,
      product-> {
        _id,
        name,
        price,
        image,
        currency
      }
    }
  }`
  );

  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    console.log(orders.data); // Kiểm tra dữ liệu trả về từ Sanity

    return orders.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Error fetching orders");
  }
}
