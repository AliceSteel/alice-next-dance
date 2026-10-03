"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import type { OrderItem } from "@/types/OrdersType";
import type { PastBooking } from "@/types/PastBookingType";

type Purchase = OrderItem & { purchasedAt: Date; status: string };
type Tab = "bookings" | "purchases";

const TABS: { id: Tab; label: string }[] = [
  { id: "bookings", label: "Past Bookings" },
  { id: "purchases", label: "Purchases" },
];

const bookingStatus = (status: string) =>
  status === "CANCELLED"
    ? { label: "Cancelled", dot: "bg-gray-400" }
    : { label: "Completed", dot: "bg-green-500" };

export default function HistoryTable({
  pastBookings,
  memberships,
}: {
  pastBookings: PastBooking[];
  memberships: Purchase[];
}) {
  const [tab, setTab] = useState<Tab>("bookings");

  return (
    <section className="mt-8 rounded-md border border-gray-400/50 bg-black/40">
      <div role="tablist" className="flex border-b border-gray-400/50">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`px-6 py-4 text-sm uppercase transition-colors ${
              tab === id
                ? "border-b-2 border-sky-400 text-sky-400"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto p-4" role="tabpanel">
        {/* Booking history  */}
        {tab === "bookings" ? (
          pastBookings.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-400">
                <tr>
                  <th className="py-2 font-normal">Date</th>
                  <th className="py-2 font-normal">Class</th>
                  <th className="hidden sm:table-cell py-2 font-normal">
                    Instructor
                  </th>
                  <th className="py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {pastBookings.map((booking) => {
                  const status = bookingStatus(booking.status);
                  return (
                    <tr
                      key={booking.id}
                      className="border-t border-gray-700/50"
                    >
                      <td className="py-3">{booking.date}</td>
                      <td className="py-3">{booking.title}</td>
                      <td className="hidden sm:table-cell py-3">
                        {booking.instructor}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="py-4 text-gray-400">No past bookings yet.</p>
          )
        ) : memberships.length > 0 ? (
          /* Membership purchase history */
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-400">
              <tr>
                <th className="py-2 font-normal">Date</th>
                <th className="py-2 font-normal">Membership</th>
                <th className="py-2 font-normal">Qty</th>
                <th className="py-2 font-normal">Price</th>
                <th className="py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((item) => (
                <tr key={item.id} className="border-t border-gray-700/50">
                  <td className="py-3">
                    {DateTime.fromJSDate(item.purchasedAt).toFormat(
                      "dd-MM-yyyy",
                    )}
                  </td>
                  <td className="py-3">{item.product.name}</td>
                  <td className="py-3">{item.quantity}</td>
                  <td className="py-3">{item.price}</td>
                  <td className="py-3 capitalize">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="py-4 text-gray-400">No purchases yet.</p>
        )}
      </div>
    </section>
  );
}
