import type { ScheduleGridProps } from "./ScheduleGridProps.js";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ChevronLeftOutlined } from "@lineiconshq/free-icons";

export default function ScheduleGrid({
  days,
  timeSlots,
  currentWeek,
  selectedCategoryId,
  getEntryFor,
  weekIndex,
  weeks,
  setWeekIndex,
  onEntryClick,
  alreadyBookedEntries,
}: ScheduleGridProps) {
  return (
    <div className="relative grid grid-cols-8 grid-rows-6 text-center w-full min-w-[600px] overflow-x-scroll">
      {/* header row: day names */}
      <div></div>
      {days.map((day) => (
        <div
          key={day}
          className="font-semibold text-white border border-gray-600 bg-white/10 text-sm p-2 flex flex-col items-center justify-center"
        >
          <span>{day}</span>
          <span>{currentWeek.startDate}</span>
        </div>
      ))}

      {/* 5 rows of time slots x 7 days */}
      {timeSlots.map((slot: string) => (
        <div key={`time-${slot}`} className="contents">
          {/* time label cell (first column) */}
          <div className="p-2 border border-gray-600 bg-white/10 text-sm text-white flex items-center justify-center">
            {slot}
          </div>

          {/* 7 day cells for this time slot */}
          {days.map((day: string) => {
            const entry = getEntryFor(day, slot);
            const isHiddenByFilter =
              selectedCategoryId !== "all" &&
              selectedCategoryId &&
              entry &&
              entry.classId !== selectedCategoryId;

            const isClickable = entry && !isHiddenByFilter;
            const isBooked = !!(
              entry && alreadyBookedEntries?.includes(entry.id)
            );

            return (
              <button
                type="button"
                key={`${day}-${slot}`}
                className={`py-4 px-2 border border-[#333] bg-[#222] text-white uppercase text-xs text-center ${
                  isClickable ? "cursor-pointer hover:bg-white/10" : ""
                }`}
                onClick={() => {
                  if (isClickable && entry && onEntryClick) {
                    onEntryClick(entry);
                  }
                }}
              >
                {/* show only when there is an entry and it’s not hidden */}
                {entry && !isHiddenByFilter && (
                  <div className="whitespace-nowrap flex flex-col items-center justify-center gap-1">
                    {/* class label/id */}
                    {entry.label ?? entry.classId}
                    {/* optional teacher on next line */}
                    {entry.teacher && (
                      <>
                        <br />
                        <span className="normal-case text-[0.7rem] text-gray-300">
                          {entry.teacher}
                        </span>
                      </>
                    )}
                    {/* show "booked" indicator if already booked */}
                    {isBooked ? (
                      <span className=" text-blue-500">(Booked)</span>
                    ) : (
                      <span className="underline">Book</span>
                    )}
                    {}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ))}
      {/* navigation buttons */}
      {weekIndex > 0 && (
        <button
          type="button"
          className="absolute -left-2 top-5 md:top-9 h-16 w-6"
          title="Previous Week"
          onClick={() =>
            setWeekIndex((prevIndex: number) =>
              prevIndex > 0 ? prevIndex - 1 : prevIndex,
            )
          }
        >
          <Lineicons
            icon={ChevronLeftOutlined}
            size={40}
            className="text-white/60 hover:text-white/100 transition-opacity duration-300 cursor-pointer"
          />
        </button>
      )}
      {weekIndex < weeks.length - 1 && (
        <button
          type="button"
          className="absolute -right-6 top-3 lg:top-9 h-10 w-6"
          title="Next Week"
          onClick={() =>
            setWeekIndex(
              (prevIndex) =>
                prevIndex < weeks.length - 1 ? prevIndex + 1 : prevIndex, // <-- increment
            )
          }
        >
          <Lineicons
            icon={ChevronLeftOutlined}
            size={40}
            className="rotate-180 text-white/60 hover:text-white/100 transition-opacity duration-300 cursor-pointer"
          />
        </button>
      )}
    </div>
  );
}
