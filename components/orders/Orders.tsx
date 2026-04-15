import type { Order } from "./OrdersType";

export default function Orders({ orders }: { orders: Order[] }) {
  return (
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
          <p>Total: DKK {order.orderTotalPrice}</p>
          <p>Status: {order.status}</p>
          <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
