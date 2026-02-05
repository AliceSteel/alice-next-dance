import type { ScheduleResponse } from "@/types/ScheduleItem";
import scheduleData from "@/data/scheduleData.json";
import ScheduleClient from "./components/scheduleClient/ScheduleClient";
import { classes } from "@/data/classesData";
import { instructors } from "@/data/instructorsData";
import type { ClassesState, Category, Instructor } from "@/types/classesTypes";
import type { Class } from "@/types/ClassDescription";
import PriceList from "./components/priceList/PriceList";
import {
  fetchProducts,
  fetchPassesTitleRecord,
  fetchBtnTitleRecord,
} from "@/helpers/actions";
import { Suspense } from "react";

export default async function SchedulePage() {
  // when BE is connected, replace with fetch:
  /* const res = await fetch("/api/schedule");
  const data: ScheduleEntry[] = await res.json();

  if (!res.ok) {
    throw new Response("Failed to load schedule", { status: res.status });
  }
  const data: ScheduleResponse = await res.json(); */

  const products = await fetchProducts();
  const passesTitle = await fetchPassesTitleRecord();
  const btnTitle = await fetchBtnTitleRecord();

  const weeks = scheduleData.weeks as ScheduleResponse["weeks"];
  const categoriesFromClasses: Category[] = classes.map((c: Category) => ({
    id: c.id,
    title: c.title,
  }));

  const classesWithInstructors = classes.map((classItem: Class) => {
    const instructorForClass = instructors.find(
      (i: Instructor) => i.id === classItem.id,
    );
    return {
      ...classItem,
      instructor: instructorForClass || undefined,
    };
  });

  return (
    <>
      <ScheduleClient
        weeks={weeks}
        classCategories={categoriesFromClasses}
        classItems={classesWithInstructors}
      />
      {/* CHECK if it scrolls down after modal closed here */}
      <section id="membership-options" className="page-container py-20">
        <h2 className="text-2xl uppercase mb-5">{passesTitle}</h2>
      </section>
      <Suspense fallback={<div>Loading prices...</div>}>
        <PriceList prices={products} purchaseButtonTitle={btnTitle} />
      </Suspense>
    </>
  );
}
