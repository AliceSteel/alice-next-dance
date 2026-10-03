import { fetchUserOrders, fetchUserPasses } from "@/app/actions/orderActions";
import SuccessToast from "../admin/edit/components/SuccessToast";
import Orders from "@/components/orders/Orders";
import { DateTime } from "luxon";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import BookingsClientList from "./components/BookingsClientList";
import Image from "next/image";
import AnimatedRings from "@/components/animatedRings/AnimatedRings";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { CreditCardMultipleSolid } from "@lineiconshq/free-icons";
import HistoryTable from "./components/HistoryTable";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const pageBgImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images-bucket/account-bg.png`;
  const orders = await fetchUserOrders();
  const purchasedMemberships = orders.flatMap((order) =>
    order.orderItems.map((item) => ({
      ...item,
      purchasedAt: order.createdAt,
      status: order.status,
    })),
  );
  const { success } = await searchParams;
  const successMessage =
    success === "ordercreated" ? "Your purchase was successful!" : null;

  const passes = await fetchUserPasses(); // [] if not logged in
  const now = DateTime.now().toMillis();

  const activePasses = passes.filter((pass) => pass.expiresAt.getTime() >= now);

  const allBookings = passes.flatMap((pass) =>
    pass.bookings.map((booking) => {
      const { session } = booking;
      const start = DateTime.fromJSDate(session.startsAt, {
        zone: session.template.timezone,
      });
      const end = start.plus({ minutes: session.template.durationMin });

      return {
        id: booking.id,
        startsAtMs: start.toMillis(),
        date: start.toFormat("dd-MM-yyyy"),
        label: session.template.label,
        title: session.template.danceClass.title,
        instructor: session.template.instructor.name,
        instructorSlug: session.template.instructor.slug,
        timeSlot: `${start.toFormat("HH:mm")}-${end.toFormat("HH:mm")}`,
        status: booking.status,
      };
    }),
  );
  //For UPCOMING BOOKINGS cards:
  const bookingCards = allBookings
    .filter((b) => b.startsAtMs >= now)
    .sort((a, b) => a.startsAtMs - b.startsAtMs);

  //for PAST BOOKINGS table:
  const pastBookings = allBookings
    .filter((b) => b.startsAtMs < now)
    .sort((a, b) => b.startsAtMs - a.startsAtMs);
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Image
        src={pageBgImage}
        alt="Account background"
        fill
        className="object-cover -inset-1"
      />

      <div className="page-container-sm relative z-10 pt-24">
        {successMessage && <SuccessToast message={successMessage} />}

        <SectionTitle
          title="My Account."
          subtitle="Manage bookings and memberships"
        />
        {/* MEMBERSHIPS SECTION */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl">My Memberships</h2>
          {activePasses.length > 0 ? (
            <ul className="flex flex-wrap gap-4">
              {activePasses.map((pass) => {
                const remaining =
                  pass.creditsRemaining === null
                    ? "Unlimited"
                    : Math.max(pass.creditsRemaining - pass.bookings.length, 0);

                const ringValue =
                  remaining === "Unlimited"
                    ? "Unlimited"
                    : `${remaining}/${pass.bookings.length}`;
                return (
                  <li
                    key={pass.id}
                    className="flex-1 border border-gray-400 rounded-md p-4 flex gap-2 text-sm text-gray-400 max-w-96 lg:max-w-1/3"
                  >
                    <div className="flex flex-col items-start gap-2">
                      <h5 className="text-sm uppercase">active membership </h5>
                      <p className="text-lg text-white font-semibold">
                        {pass.orderItem.product.name}
                      </p>
                      <p className="">{remaining} classes left</p>
                      <p className="mt-auto">
                        Valid until{" "}
                        {DateTime.fromJSDate(pass.expiresAt).toFormat(
                          "dd-MM-yyyy",
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between items-end gap-2 w-1/2 shrink-0 ">
                      <Lineicons
                        icon={CreditCardMultipleSolid}
                        className="text-gray-400"
                      />
                      <div className="w-full max-w-36 p-3">
                        <AnimatedRings stats={[{ label: ringValue }]} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>You have no active memberships.</p>
          )}
        </section>
        {/* UPCOMING CLASSES SECTION */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl uppercase">Upcoming Classes</h2>
          {bookingCards.length > 0 ? (
            <BookingsClientList bookings={bookingCards} />
          ) : (
            <p>You have no bookings yet.</p>
          )}
        </section>
        {/* History of Bookings, and membership purchaces */}
        <HistoryTable
          pastBookings={pastBookings}
          memberships={purchasedMemberships}
        />
        {/*  {orders.length > 0 ? (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl">My Orders</h2>
            <Orders orders={orders} />
          </section>
        ) : (
          <p className="mt-8">You have no orders yet.</p>
        )} */}
      </div>
    </div>
  );
}
