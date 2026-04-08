import { fetchUserOrders } from "@/app/actions/actions";
import SuccessToast from "../admin/edit/components/SuccessToast";
import Orders from "@/components/orders/Orders";
import ClearCartOnSuccess from "./ClearCartOnSuccess";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const orders = await fetchUserOrders();
  const { success } = await searchParams;
  const successMessage =
    success === "ordercreated" ? "Order placed successfully!" : null;

  return (
    <div className="page-container pt-24">
      <ClearCartOnSuccess success={success} />
      <h1 className="text-4xl mb-8">My Account</h1>

      {successMessage && <SuccessToast message={successMessage} />}

      {orders.length > 0 ? (
        <>
          <h2 className="text-2xl mb-4">My Orders</h2>
          <Orders orders={orders} />
        </>
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
}
