import { fetchAllOrders } from "@/app/actions/actions";

import Orders from "@/components/orders/Orders";

export default async function SalesPage() {
  const orders = await fetchAllOrders();
  return (
    <div>
      <h2 className="text-2xl mb-4">Sales</h2>
      {orders.length > 0 ? <Orders orders={orders} /> : <p>No orders found.</p>}
    </div>
  );
}
