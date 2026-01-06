import type { ScheduleResponse } from "@/types/ScheduleItem";
import scheduleData from "@/data/scheduleData.json";
import { passes, passesTitle, purchaseButtonTitle } from "@/data/passesData";
import ScheduleClient from "./components/scheduleClient/ScheduleClient";
import { classes } from "@/data/classesData";
import { instructors } from "@/data/instructorsData";
import type { ClassesState, Category, Instructor } from "@/types/classesTypes";
import type { Class } from "@/types/ClassDescription";

export default async function SchedulePage() {
  // when BE is connected, replace with fetch:
  /* const res = await fetch("/api/schedule");
  const data: ScheduleEntry[] = await res.json();

  if (!res.ok) {
    throw new Response("Failed to load schedule", { status: res.status });
  }
  const data: ScheduleResponse = await res.json(); */
  const weeks = scheduleData.weeks as ScheduleResponse["weeks"];
  const categoriesFromClasses: Category[] = classes.map((c: Category) => ({
    id: c.id,
    title: c.title,
  }));

  const classesWithInstructors = classes.map((classItem: Class) => {
    const instructorForClass = instructors.find(
      (i: Instructor) => i.id === classItem.id
    );
    return {
      ...classItem,
      instructor: instructorForClass || undefined,
    };
  });

  return (
    <ScheduleClient
      weeks={weeks}
      passes={passes}
      passesTitle={passesTitle}
      purchaseButtonTitle={purchaseButtonTitle}
      classCategories={categoriesFromClasses}
      classItems={classesWithInstructors}
    />
  );
}
