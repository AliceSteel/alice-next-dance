import type {
  BookableScheduleEntry,
  BookableScheduleWeek,
} from "@/types/ScheduleItem";
import type { SetStateAction, Dispatch } from "react";

export type ScheduleGridProps = {
  days: string[];
  timeSlots: string[];
  currentWeek: BookableScheduleWeek;
  selectedCategoryId: string | number | null;
  getEntryFor: (day: string, slot: string) => BookableScheduleEntry | undefined;
  weekIndex: number;
  weeks: BookableScheduleWeek[];
  setWeekIndex: Dispatch<SetStateAction<number>>;
  onEntryClick?: (entry: BookableScheduleEntry) => void;
  alreadyBookedEntries?: string[];
};
