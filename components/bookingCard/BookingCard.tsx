import { useEffect, useRef, useState } from "react";
import type { BookingCardProps } from "./BookingCardTypes";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowRightOutlined } from "@lineiconshq/free-icons";

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
      className={`relative flex flex-col justify-start gap-4 rounded-sm p-4 transition-all duration-500 ease-in-out ${
        isOpen ? "w-full delay-0" : "w-full md:w-[49.2%] delay-500"
      } ${
        isLeftColumn ? "mr-auto" : "ml-auto last:ml-0"
      } ${index === 0 ? "border-sky-400 border-2" : "border border-gray-100"}`}
    >
      <div className="flex items-start justify-start gap-4">
        <div className="w-32 h-20 bg-gray-200 flex items-center justify-center">
          {booking.picUrl && (
            <img
              src={
                typeof booking.picUrl === "string"
                  ? booking.picUrl
                  : booking.picUrl.src
              }
              alt={booking.title}
              className="w-full h-full object-cover"
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
        <div>
          {booking.instructor} read more about the instructor
          <p>Reschedule and cancel buttons go here</p>
        </div>
      )}

      <button
        type="button"
        className="w-min self-end flex items-center justify-center gap-2 uppercase text-xs text-nowrap p-2 relavive right-4 bottom-4  bg-sky-400 text-black rounded-sm"
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
