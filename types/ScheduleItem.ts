export type Day =
  | "Mon"
  | "Tue"
  | "Wed"
  | "Thu"
  | "Fri"
  | "Sat"
  | "Sun";

export type TimeSlot =
  | "09-10:30"
  | "11:00-12:30"
  | "13:00-14:30"
  | "15:00-16:30"
  | "17:00-18:30";

export type ScheduleEntry = {
  id: string;        // e.g. "mon-09-10:30-ballet-1"
  day: Day | string;
  timeSlot: TimeSlot;
  classId: string;   // links to your classesData id, e.g. "ballet-1"
  label?: string; 
  teacher?: string;  // optional teacher name like "Sofia M."
};

export type ScheduleWeek = {
  id: string;         // e.g. "2025-W48"
  label: string;      // e.g. "Week of Nov 24"
  startDate: string;  // ISO date string, e.g. "2025-11-24"
  days: string[];     // ["Mon","Tue",...]
  entries: ScheduleEntry[];
};

export type ScheduleResponse = {
    weeks: ScheduleWeek[]; // ordered, first is the one seen initially
}