import { fetchUserOrders, fetchUserPasses } from "@/app/actions/orderActions";
import SuccessToast from "../admin/edit/components/SuccessToast";
import Orders from "@/components/orders/Orders";
import { DateTime } from "luxon";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import BookingsClientList from "./components/BookingsClientList";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const orders = await fetchUserOrders();
  const { success } = await searchParams;
  const successMessage =
    success === "ordercreated" ? "Order placed successfully!" : null;

  const passes = await fetchUserPasses(); // [] if not logged in
  const now = DateTime.now().toMillis();

  const activePasses = passes.filter((pass) => pass.expiresAt.getTime() >= now);
  const bookingCards = passes.flatMap((pass) =>
    pass.bookings
      .filter((booking) => {
        const { session } = booking;
        return (
          DateTime.fromJSDate(session.startsAt, {
            zone: session.template.timezone,
          }).toMillis() >= now
        );
      })
      .map((booking) => {
        const { session } = booking;
        const start = DateTime.fromJSDate(session.startsAt, {
          zone: session.template.timezone,
        });
        const end = start.plus({ minutes: session.template.durationMin });

        return {
          id: booking.id,
          date: start.toFormat("dd-MM-yyyy"),
          label: session.template.label,
          title: session.template.danceClass.title,
          instructor: session.template.instructor.name,
          instructorSlug: session.template.instructor.slug,
          timeSlot: `${start.toFormat("HH:mm")}-${end.toFormat("HH:mm")}`,
        };
      }),
  );
  return (
    <div className="page-container-sm pt-24">
      {successMessage && <SuccessToast message={successMessage} />}
      <SectionTitle
        title="My Account"
        subtitle="Manage bookings and memberships"
      />
      <section className="mt-8">
        <h2 className="mb-4 text-2xl uppercase">Upcoming Classes</h2>
        {bookingCards.length > 0 ? (
          <BookingsClientList bookings={bookingCards} />
        ) : (
          <p>You have no bookings yet.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl">My Memberships</h2>
        {activePasses.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {activePasses.map((pass) => {
              const remaining =
                pass.creditsRemaining === null
                  ? "Unlimited"
                  : Math.max(pass.creditsRemaining - pass.bookings.length, 0);
              return (
                <li key={pass.id} className="border-b border-gray-700/50 pb-4">
                  <p className="font-semibold">{pass.orderItem.product.name}</p>
                  <p className="text-sm text-gray-400">
                    {remaining} classes remaining · valid until{" "}
                    {DateTime.fromJSDate(pass.expiresAt).toFormat("dd-MM-yyyy")}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>You have no active memberships.</p>
        )}
      </section>

      {orders.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 text-2xl">My Orders</h2>
          <Orders orders={orders} />
        </section>
      ) : (
        <p className="mt-8">You have no orders yet.</p>
      )}
    </div>
  );
}
