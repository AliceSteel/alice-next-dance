"use client";

import { useState } from "react";
import BookingCard from "@/components/bookingCard/BookingCard";

type BookingCardData = {
  id: string;
  date: string;
  label: string;
  title: string;
  instructor: string;
  timeSlot: string;
};

export default function ClientBookingsList({
  bookings,
}: {
  bookings: BookingCardData[];
}) {
  const [openBookingId, setOpenBookingId] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-wrap items-start justify-start gap-[1vw]">
      {bookings.map((booking, index) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          index={index}
          isOpen={openBookingId === booking.id}
          onToggleOpen={() =>
            setOpenBookingId((current) =>
              current === booking.id ? null : booking.id,
            )
          }
        />
      ))}
    </div>
  );
}
