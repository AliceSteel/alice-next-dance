import { fetchUserOrders, fetchUserPasses } from "@/app/actions/orderActions";
import SuccessToast from "../admin/edit/components/SuccessToast";
import Orders from "@/components/orders/Orders";
import { DateTime } from "luxon";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const orders = await fetchUserOrders();
  const { success } = await searchParams;
  const successMessage =
    success === "ordercreated" ? "Order placed successfully!" : null;
  console.log("success message: ", successMessage);

  const passes = await fetchUserPasses(); // [] if not logged in

  return (
    <div className="page-container-sm pt-24">
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
      {passes.length > 0 ? (
        <>
          <h2 className="text-2xl mb-4">My Memberships</h2>
          <ul className="flex flex-col gap-6">
            {passes.map((pass) => {
              const totalCredits = pass.creditsRemaining;
              const usedCredits = pass.bookings.length;
              const remaining =
                totalCredits === null
                  ? "Unlimited"
                  : Math.max(totalCredits - usedCredits, 0);

              return (
                <li key={pass.id} className="border-b border-gray-700/50 pb-4">
                  <p className="font-semibold">{pass.orderItem.product.name}</p>
                  <p className="text-sm text-gray-400">
                    {remaining} classes remaining · valid until{" "}
                    {DateTime.fromJSDate(pass.expiresAt).toFormat("dd-MM-yyyy")}
                  </p>

                  {pass.bookings.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1 text-sm">
                      {pass.bookings.map((booking) => {
                        const { session } = booking;
                        const start = DateTime.fromJSDate(session.startsAt, {
                          zone: session.template.timezone,
                        });
                        return (
                          <li key={booking.id}>
                            {session.template.danceClass.title} —{" "}
                            {start.toFormat("dd-MM-yyyy HH:mm")} with{" "}
                            {session.template.instructor.name} ({booking.status}
                            )
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p>You have no passes yet.</p>
      )}
    </div>
  );
}
