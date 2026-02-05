import type { ScheduleResponse } from "@/types/ScheduleItem";
import type { Category } from "@/types/classesTypes";
import type { Class } from "@/types/ClassDescription";

export type ScheduleClientProps = {
    weeks: ScheduleResponse["weeks"];
    classCategories?: Category[];
    classItems?: Class[];
};