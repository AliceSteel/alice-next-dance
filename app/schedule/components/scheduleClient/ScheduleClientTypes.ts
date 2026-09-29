import type { BookableScheduleWeek } from "@/types/ScheduleItem";
import type { BookingPackage } from "@/types/User";

export type ScheduleClientProps = {
  weeks: BookableScheduleWeek[];
  bookingPackages: BookingPackage[];
};
