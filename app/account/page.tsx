import { fetchUserOrders } from "@/helpers/actions";
import SuccessToast from "../admin/edit/components/SuccessToast";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const orders = await fetchUserOrders();
  console.log("Fetched orders:", orders);

  const { success } = searchParams;
  const successMessage =
    success === "ordercreated" ? "Order placed successfully!" : null;

  return (
    <div className="page-container pt-24">
      <h1 className="text-4xl mb-8">My Account</h1>

      {successMessage && <SuccessToast message={successMessage} />}

      {orders.length > 0 && <h2 className="text-2xl mb-4">My Orders</h2>}
      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={order.orderId} className="border p-4 rounded">
            <p>Order ID: {order.orderId}</p>
            {order.orderItems.map((item) => (
              <div key={item.id} className="ml-4">
                <p>Name: {item.product.name}</p>
                <p>Price: {item.price}</p>
                <p>Product ID: {item.productId}</p>
              </div>
            ))}
            <p>Total: ${order.orderTotalPrice}</p>
            <p>Status: {order.status}</p>
            <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
