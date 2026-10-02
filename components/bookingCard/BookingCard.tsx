import { useEffect, useRef, useState } from "react";
import type { BookingCardProps } from "./BookingCardTypes";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowRightOutlined } from "@lineiconshq/free-icons";
import Link from "next/link";
import FormContainer from "@/components/formElements/FormContainer";
import { SubmitBtn } from "@/components/formElements/SubmitBtn";
import { cancelBooking } from "@/app/actions/scheduleActions";
import Image from "next/image";

export default function BookingCard({
  booking,
  index = 0,
  isOpen = false,
  onToggleOpen,
  onLeftColumnChange,
}: BookingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLeftColumn, setIsLeftColumn] = useState(false);

  useEffect(() => {
    const updateColumn = () => {
      const card = cardRef.current;
      const container = card?.parentElement;
      if (!card || !container) return;

      const nextIsLeftColumn =
        Math.abs(card.offsetLeft - container.offsetLeft) <= 10;

      setIsLeftColumn(nextIsLeftColumn);
      onLeftColumnChange?.(nextIsLeftColumn);
    };

    updateColumn();
    window.addEventListener("resize", updateColumn);
    return () => window.removeEventListener("resize", updateColumn);
  }, [onLeftColumnChange]);

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col justify-start gap-4 rounded-sm p-4 transition-all duration-500 ease-in-out backdrop-blur-md bg-black/40 ${
        isOpen ? "w-full delay-0" : "w-full md:w-[49.2%] delay-500"
      } ${
        isLeftColumn ? "mr-auto" : "ml-auto last:ml-0"
      } ${index === 0 ? "border-sky-400 border-2" : "border border-gray-100"}`}
    >
      <div className="flex items-start justify-start gap-4">
        <div className="w-32 h-20 bg-gray-200 flex items-center justify-center overflow-hidden">
          {booking.picUrl && (
            <Image
              src={booking.picUrl}
              alt={booking.title}
              width={32}
              height={20}
              sizes="128px"
              className="object-cover w-full"
            />
          )}
        </div>
        <div>
          <h4>{booking.label}</h4>

          <p>{booking.date}</p>
          <p>{booking.timeSlot}</p>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col items-start gap-4">
          <p>With {booking.instructor}</p>
          <Link
            href={`/classes/${booking.instructorSlug}#teachers`}
            className="underline"
          >
            Read more about the instructor
          </Link>

          <FormContainer action={cancelBooking}>
            <input type="hidden" name="bookingId" value={String(booking.id)} />
            <SubmitBtn label="Cancel booking" actionType="delete" />
          </FormContainer>
        </div>
      )}

      <button
        type="button"
        className="w-min self-end flex items-center justify-center gap-2 uppercase text-xs text-nowrap p-2 absolute right-4 bottom-4  bg-sky-400 text-black rounded-sm"
        aria-label={isOpen ? "Close booking details" : "Open booking details"}
        onClick={() => onToggleOpen(index)}
      >
        <span>{isOpen ? "close" : "view"}</span>
        <span> details</span>
        <Lineicons
          icon={ArrowRightOutlined}
          className={`transition-all duration-500 ${isOpen ? "rotate-[-180deg]" : ""}`}
        />
      </button>
    </div>
  );
}
