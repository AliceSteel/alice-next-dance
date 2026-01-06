import type { ScheduleResponse } from "@/types/ScheduleItem";
import type { Pass } from "@/types/Pass";
import type { Category } from "@/types/classesTypes";
import type { Class } from "@/types/ClassDescription";

export type ScheduleClientProps = {
    weeks: ScheduleResponse["weeks"];
    passes: Pass[];
    passesTitle: string;
    purchaseButtonTitle: string;
    classCategories?: Category[];
    classItems?: Class[];
};