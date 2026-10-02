"use client";

import { useState } from "react";
import BookingCard from "@/components/bookingCard/BookingCard";
import { selectClasses } from "@/store/slices/classes/classesSlice";
import { useSelector } from "react-redux";
import type { BookingCardData } from "@/types/BookingCardData";

export default function ClientBookingsList({
  bookings,
}: {
  bookings: BookingCardData[];
}) {
  const [openBookingId, setOpenBookingId] = useState<string | null>(null);
  const classes = useSelector(selectClasses);
  const bookingsWithImages = bookings.map((booking) => {
    const classImage = classes.find((cls) => cls.title === booking.title);
    return {
      ...booking,
      picUrl: classImage?.imageUrl || "",
    };
  });

  return (
    <div>
      <div className="flex w-full flex-wrap items-start justify-start gap-[1vw]">
        {bookingsWithImages.map((booking, index) => (
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
    </div>
  );
}
