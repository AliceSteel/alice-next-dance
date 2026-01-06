import type { ScheduleEntry, ScheduleWeek } from "@/types/ScheduleItem";
import type { SetStateAction, Dispatch } from "react";

export type ScheduleGridProps = {
    days: string[];
    timeSlots: string[];
    currentWeek: ScheduleWeek;
    selectedCategoryId: string | null;
    getEntryFor: (day: string, slot: string) => ScheduleEntry | undefined;
    weekIndex: number;
    weeks: ScheduleWeek[];
    setWeekIndex: Dispatch<SetStateAction<number>>;
    onEntryClick?: (entry: ScheduleEntry) => void;
    alreadyBookedEntries?: string[];
}